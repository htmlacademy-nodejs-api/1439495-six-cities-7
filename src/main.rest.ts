import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication, createRestApplicationContainer } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { UserService, createUserContainer } from './shared/modules/user/index.js';
import { createOfferContainer } from './shared/modules/offer/index.js';

function bootstrap() {
  const container = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer()
  );
  const application = container.get<RestApplication>(Component.RestApplication);

  application.init();

  const service = container.get<UserService>(Component.UserService);
  service.create({
    name: 'Name',
    mail: 'maisdl@mail.ru',
    avatar: 'sdfsf',
    password: 'sdfsd4dsf',
    isPro: false
  }, 'dghjad');
}

bootstrap();
