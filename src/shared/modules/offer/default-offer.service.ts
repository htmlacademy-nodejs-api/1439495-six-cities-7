import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { CreateOfferDto, UpdateOfferDto, OfferEntity, OfferService } from './index.js';
import { Logger } from '../../libs/logger/index.js';
import { DEFAULT_OFFER_LIMIT, PREMIUM_OFFER_LIMIT } from './offer.constant.js';
import { SortType, Component, City } from '../../types/index.js';
import { Types } from 'mongoose';
import { UserEntity } from '../user/index.js';

const addRatingToOffers = [
  {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'offerId',
      as: 'comments'
    },
  },
  {
    $addFields: {
      id: { $toString: '$_id'},
      rating: { $avg: '$comments.rating' }
    }
  }
];

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async exists(id: string): Promise<boolean> {
    const result = await this.offerModel.exists({_id: id});
    return result !== null;
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`Offer ${dto.name} was successfully created`);
    return result;
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    const result = await this.offerModel
      .aggregate<DocumentType<OfferEntity> | null>([
        {
          $match: {
            _id: new Types.ObjectId(id),
          }
        },
        {
          $lookup: {
            from: 'comments',
            localField: '_id',
            foreignField: 'offerId',
            as: 'comments'
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'users'
          },
        },
        {
          $addFields: {
            commentCount: { $size: '$comments' },
            rating: { $avg: '$comments.rating' },
            user: { '$arrayElemAt': ['$users', 0] },
            isFavorite: { $in: '$user.favoriteOffersId' }
          }
        },
        { $unset: ['comments', 'users'] },
      ]).exec();
    return result[0];
  }

  public async findAll(count: number = DEFAULT_OFFER_LIMIT): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        ...addRatingToOffers,
        { $addFields: { isFavorite: false } },
        { $unset: ['comments', 'description', 'photo', 'rooms', 'guests', 'amenities', 'userId'] },
        { $sort: { createdAt: SortType.Down } },
        { $limit: count }
      ]).exec();
  }

  public async findAllForUser(userId: string, count: number = DEFAULT_OFFER_LIMIT): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.userModel.findById(userId);
    return this.offerModel
      .aggregate([
        ...addRatingToOffers,
        { $addFields: { isFavorite: { $in: user?.favoriteOffersId } } },
        { $unset: ['comments', 'description', 'photo', 'rooms', 'guests', 'amenities', 'userId'] },
        { $sort: { createdAt: SortType.Down } },
        { $limit: count }
      ]).exec();
  }

  public async findPremium(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        {
          $match: {
            isPremium: true,
            city
          }
        },
        ...addRatingToOffers,
        { $unset: ['comments', 'description', 'photo', 'rooms', 'guests', 'amenities', 'userId'] },
        { $sort: { createdAt: SortType.Down } },
        { $limit: PREMIUM_OFFER_LIMIT }
      ]).exec();
  }

  public async findFavorite(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.userModel.findById(userId);
    return this.offerModel
      .aggregate([
        {
          $match: {
            _id: { $in: user?.favoriteOffersId }
          }
        },
        ...addRatingToOffers,
        { $addFields: { isFavorite: true } },
        { $unset: ['comments', 'description', 'photo', 'rooms', 'guests', 'amenities', 'userId'] },
      ]).exec();
  }

  public async addToFavorite({userId, offerId}: {userId: string, offerId: string}): Promise<DocumentType<OfferEntity> | null> {
    await this.userModel.findByIdAndUpdate(userId, { $push: {favoriteOffersId: offerId} }).exec();
    return this.findById(offerId);
  }

  public async deleteFromFavorite({userId, offerId}: {userId: string, offerId: string}): Promise<DocumentType<OfferEntity> | null> {
    await this.userModel.findByIdAndUpdate(userId, { $pull: {favoriteOffersId: offerId} }).exec();
    return this.findById(offerId);
  }

  public async updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(id, dto, {new: true}).populate(['userId']).exec();
  }

  public async deleteById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(id).exec();
  }

  public async incCommentCount(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(id, {'$inc': {
      commentCount: 1,
    }}).exec();
  }
}
