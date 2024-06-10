import { Container } from 'inversify';
import { AuthService, DefaultAuthService } from './index.js';
import { Component } from '../../types/index.js';

export function createAuthContainer() {
  const authContainer = new Container();
  authContainer.bind<AuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();

  return authContainer;
}
