import { injectable, inject } from 'inversify';
import * as crypto from 'node:crypto';
import { SignJWT } from 'jose';
import { AuthService } from './auth-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { LoginUserDto, UserEntity, UserService } from '../user/index.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { TokenPayload } from './token-payload.type.js';
import { JWT_ALGORITHM, JWT_EXPIRED } from './auth.constant.js';
import { BaseUserException } from './errors/index.js';
import { StatusCodes } from 'http-status-codes';


@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
      @inject(Component.Logger) private readonly logger: Logger,
      @inject(Component.UserService) private readonly userService: UserService,
      @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      mail: user.mail,
      name: user.name,
      avatar: user.avatar,
      isPro: user.isPro,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.mail}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.mail);

    if (!user || !user.verifyPassword(dto.password, this.config.get('SALT'))) {
      throw new BaseUserException(StatusCodes.UNAUTHORIZED, 'Incorrect user email or password');
    }

    return user;
  }
}
