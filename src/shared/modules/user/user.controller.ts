import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { BaseController } from '../../libs/rest/controller/index.js';
import { Component, HttpMethod } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateUserDto, LoginUserDto, UserRdo, UserService } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { HttpError } from '../../libs/rest/errors/index.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {
    super(logger);

    this.addRoute({ path: '/login', method: HttpMethod.Get, handler: this.login });
    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
  }

  public async login({body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.mail);
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, `User with email ${body.mail} not found.`, 'UserController');
    }
    this.ok(res, fillDTO(UserRdo, user));
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.mail);
    if (user) {
      throw new HttpError(StatusCodes.CONFLICT, `User with email ${body.mail} is already exist`, 'UserController');
    }
    const result = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

}
