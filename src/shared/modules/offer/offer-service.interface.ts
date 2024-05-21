import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto, OfferEntity, UpdateOfferDto } from './index.js';
import { City } from '../../types/index.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  findAll(count: number): Promise<DocumentType<OfferEntity>[]>;
  findPremium(city: City): Promise<DocumentType<OfferEntity>[]>;
  findFavorite(): Promise<DocumentType<OfferEntity>[]>;
  addToFavorite(id: string): Promise<DocumentType<OfferEntity> | null>;
  deleteFromFavorite(id: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(id: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(id: string): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(id: string): Promise<DocumentType<OfferEntity> | null>;
}
