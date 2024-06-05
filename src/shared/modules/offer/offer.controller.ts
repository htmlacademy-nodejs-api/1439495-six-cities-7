import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { BaseController } from '../../libs/rest/controller/index.js';
import { City, Component, HttpMethod } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateOfferDto, OfferRdo, OfferService, FullOfferRdo, UpdateOfferDto } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { DocumentExistsMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/middleware/index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getFullInfo,
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new ValidateDtoMiddleware(UpdateOfferDto), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId'), new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')]
    });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findAll();
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(FullOfferRdo, result));
  }

  public async getFullInfo(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(req.params.offerId);
    this.ok(res, fillDTO(FullOfferRdo, offer));
  }

  public async update({body, params}: Request<Record<string, string>, Record<string, unknown>, UpdateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(FullOfferRdo, offer));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.deleteById(req.params.offerId);
    this.noContent(res, fillDTO(FullOfferRdo, offer));
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findPremium(req.params.city as City);
    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
