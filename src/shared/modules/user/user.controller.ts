import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { BaseController } from '../../libs/rest/controller/index.js';
import { Component, HttpMethod } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateUserDto, LoginUserDto, UserRdo, UserService } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';

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
      throw new Error('Неверно!');
    }
    const data = fillDTO(UserRdo, user);
    this.ok(res, data);
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.mail);
    if (user) {
      throw new Error('Пользователь уже существует!');
    }
    const result = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

}
