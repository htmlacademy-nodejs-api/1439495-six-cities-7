import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto, OfferEntity, UpdateOfferDto } from './index.js';
import { City, DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null>;
  findAll(userId?: string, count?: number): Promise<DocumentType<OfferEntity>[]>;
  findPremium(city: City): Promise<DocumentType<OfferEntity>[]>;
  findFavorite(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addToFavorite({userId, offerId}: {userId: string, offerId: string}): Promise<DocumentType<OfferEntity> | null>;
  deleteFromFavorite({userId, offerId}: {userId: string, offerId: string}): Promise<DocumentType<OfferEntity> | null>;
  updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id: string): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(id: string): Promise<DocumentType<OfferEntity> | null>;
}
