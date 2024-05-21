import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CommentEntity, CreateCommentDto, CommentService } from './index.js';
import { COMMENTS_LIMIT } from './comment.constant.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await this.commentModel.create(dto);
    this.logger.info(`Comment with id ${result.id} was successfully created`);
    return result.populate(['userId']);
  }

  public async findAllByOfferId(id: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({offerId: id})
      .sort({createdAt: SortType.Down})
      .limit(COMMENTS_LIMIT)
      .populate(['userId'])
      .exec();
  }
}
