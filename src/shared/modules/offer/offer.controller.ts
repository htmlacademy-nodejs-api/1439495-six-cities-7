import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { BaseController } from '../../libs/rest/controller/index.js';
import { City, Component, HttpMethod } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateOfferDto, OfferRdo, OfferService, FullOfferRdo, UpdateOfferDto } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { HttpError } from '../../libs/rest/errors/index.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {
    super(logger);
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Get, handler: this.getFullInfo });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Patch, handler: this.update });
    this.addRoute({ path: '/:offerId', method: HttpMethod.Delete, handler: this.delete });
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
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${req.params.offerId} not found.`, 'OfferController');
    }
    this.ok(res, fillDTO(FullOfferRdo, offer));
  }

  public async update({body, params}: Request<Record<string, string>, Record<string, unknown>, UpdateOfferDto>, res: Response): Promise<void> {
    const offer = await this.offerService.updateById(params.offerId, body);
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${params.offerId} not found.`, 'OfferController');
    }
    this.ok(res, fillDTO(FullOfferRdo, offer));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.deleteById(req.params.offerId);
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Offer with id ${req.params.offerId} not found.`, 'OfferController');
    }
    this.noContent(res, fillDTO(FullOfferRdo, offer));
  }

  public async getPremium(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findPremium(req.params.city as City);
    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
