import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { CreateOfferDto, UpdateOfferDto, OfferEntity, OfferService } from './index.js';
import { Logger } from '../../libs/logger/index.js';
import { DEFAULT_OFFER_FIELDS_RETURN, DEFAULT_OFFER_LIMIT, PREMIUM_OFFER_LIMIT } from './offer.constant.js';
import { SortType, Component, City } from '../../types/index.js';

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
    return this.offerModel
      .findById(id)
      .populate(['userId'])
      .exec();
  }

  public async findAll(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_LIMIT;
    return this.offerModel
      .find()
      .sort({createdAt: SortType.Down})
      .limit(limit)
      .select(DEFAULT_OFFER_FIELDS_RETURN)
      .exec();
  }

  public async findPremium(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({isPremium: true, city})
      .sort({createdAt: SortType.Down})
      .limit(PREMIUM_OFFER_LIMIT)
      .select(DEFAULT_OFFER_FIELDS_RETURN)
      .exec();
  }

  public async findFavorite(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({isFavorite: true})
      .select(DEFAULT_OFFER_FIELDS_RETURN)
      .exec();
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
