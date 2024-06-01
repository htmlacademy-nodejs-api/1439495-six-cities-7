import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { BaseController } from '../../libs/rest/controller/index.js';
import { Component, HttpMethod } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CommentRdo, CommentService, CreateCommentDto } from './index.js';
import { fillDTO } from '../../helpers/index.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService
  ) {
    super(logger);
    this.addRoute({ path: '/:offerId', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.index });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const comments = await this.commentService.findAllByOfferId(req.params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateCommentDto>, res: Response): Promise<void> {
    const comment = await this.commentService.create(body);
    this.created(res, fillDTO(CommentRdo, comment));
  }
}
