import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto, OfferEntity } from './index.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
}
