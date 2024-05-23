import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { CreateOfferDto, UpdateOfferDto, OfferEntity, OfferService } from './index.js';
import { Logger } from '../../libs/logger/index.js';
import { DEFAULT_OFFER_LIMIT, PREMIUM_OFFER_LIMIT } from './offer.constant.js';
import { SortType, Component, City } from '../../types/index.js';
import { Types } from 'mongoose';

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
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

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
            user: { '$arrayElemAt': ['$users', 0] }
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

  public async findFavorite(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .aggregate([
        {
          $match: {
            isFavorite: true,
          }
        },
        ...addRatingToOffers,
        { $unset: ['comments', 'description', 'photo', 'rooms', 'guests', 'amenities', 'userId'] },
      ]).exec();
  }

  public async addToFavorite(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(id, {isFavorite: true}, {new: true}).exec();
  }

  public async deleteFromFavorite(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(id, {isFavorite: false}, {new: true}).exec();
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
