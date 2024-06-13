import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { BaseController } from '../../libs/rest/controller/index.js';
import { City, Component, HttpMethod, RequestQuery } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateOfferDto, OfferRdo, OfferService, FullOfferRdo, UpdateOfferDto, UploadImageRdo } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { DocumentExistsMiddleware, PrivateRouteMiddleware, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/middleware/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { HttpError } from '../../libs/rest/errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { CommentService } from '../comment/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
  ) {
    super(logger);
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getFullInfo,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium });
    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.getFavorite, middlewares: [new PrivateRouteMiddleware()] });
    this.addRoute({
      path: '/favorite/:offerId',
      method: HttpMethod.Patch,
      handler: this.addToFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/favorite/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFromFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'previewImage'),
      ]
    });
  }

  public async index(req: Request<unknown, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const offers = await this.offerService.findAll(req.tokenPayload?.id, req.query.limit);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({body, tokenPayload}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>, res: Response): Promise<void> {
    const result = await this.offerService.create({...body, userId: tokenPayload.id});
    this.created(res, fillDTO(FullOfferRdo, result));
  }

  public async getFullInfo({ tokenPayload, params }: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId, tokenPayload?.id);
    this.ok(res, fillDTO(FullOfferRdo, offer));
  }

  public async update({body, params, tokenPayload}: Request<Record<string, string>, Record<string, unknown>, UpdateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    if (tokenPayload.id !== offer?.userId._id.toString()) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'You can edit only your own offer',
        'Offer Controller'
      );
    }
    const result = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(FullOfferRdo, result));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(req.params.offerId);
    if (req.tokenPayload.id !== offer?.userId._id.toString()) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'You can delete only your own offer',
        'Offer Controller'
      );
    }
    const result = await this.offerService.deleteById(req.params.offerId);
    await this.commentService.deleteByOfferId(req.params.offerId);
    this.noContent(res, result);
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    if (!Object.keys(City).includes(req.params.city)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Incorrect city',
        'Offer Controller'
      );
    }
    const offers = await this.offerService.findPremium(req.params.city as City);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getFavorite({ tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorite(tokenPayload.id);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async addToFavorite({ tokenPayload, params }: Request, res: Response): Promise<void> {
    const offer = await this.offerService.addToFavorite({userId: tokenPayload.id, offerId: params.offerId});
    this.ok(res, fillDTO(FullOfferRdo, offer));
  }

  public async deleteFromFavorite({ tokenPayload, params }: Request, res: Response): Promise<void> {
    const offer = await this.offerService.deleteFromFavorite({userId: tokenPayload.id, offerId: params.offerId});
    this.ok(res, fillDTO(FullOfferRdo, offer));
  }

  public async uploadImage({ params, file }: Request, res: Response) {
    const updateDto = { previewImage: file?.filename };
    await this.offerService.updateById(params.offerId, updateDto);
    this.created(res, fillDTO(UploadImageRdo, updateDto));
  }
}
