import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { BaseController } from '../../libs/rest/controller/index.js';
import { Component, HttpMethod } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateOfferDto, OfferRdo, OfferService, FullOfferRdo } from './index.js';
import { fillDTO } from '../../helpers/index.js';

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
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findAll();
    const data = fillDTO(OfferRdo, offers);
    this.ok(res, data);
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>, res: Response): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(FullOfferRdo, result));
  }

  public async getFullInfo(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(req.params.offerId);
    const data = fillDTO(FullOfferRdo, offer);
    this.ok(res, data);
  }
}
