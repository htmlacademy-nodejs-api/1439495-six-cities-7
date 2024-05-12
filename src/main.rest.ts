import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest/index.js';
import { Config, RestConfig, RestSchema } from './shared/libs/config/index.js';
import { Logger, PinoLogger } from './shared/libs/logger/index.js';
import { Component } from './shared/types/index.js';
import { DatabaseClient, MongoDatabaseClient } from './shared/libs/database-client/index.js';
import { DefaultUserService, UserModel, UserService, UserEntity } from './shared/modules/user/index.js';
import { types } from '@typegoose/typegoose';

function bootstrap() {
  const container = new Container();

  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);

  application.init();
  container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  const service = container.get<UserService>(Component.UserService);
  service.create({
    name: 'Anna',
    mail: 'sdfsd@njd.ru',
    avatar: 'sdfsf',
    password: 'sdfsd4dsf',
    isPro: false
  }, 'dghjad');
}

bootstrap();
