import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity, CreateCommentDto } from './index.js';

export interface CommentService {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findAllByOfferId(id: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(id: string): Promise<DocumentType<CommentEntity>[] | null>;
}
