import { Container } from 'inversify';
import { AuthExceptionFilter, AuthService, DefaultAuthService } from './index.js';
import { Component } from '../../types/index.js';
import { ExceptionFilter } from '../../libs/rest/exception-filter/index.js';

export function createAuthContainer() {
    const authContainer = new Container();
    authContainer.bind<AuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
    authContainer.bind<ExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();
  
    return authContainer;
}
