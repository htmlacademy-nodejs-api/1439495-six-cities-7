import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Logger } from '../../logger/index.js';
import { Component } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';
import { createErrorObject } from '../../../helpers/index.js';
import { BaseUserException } from '../../../modules/auth/errors/index.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {}

  private handleHttpError(error: HttpError, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[${error.detail}]: ${error.httpStatusCode} — ${error.message}`, error);
    res
      .status(error.httpStatusCode)
      .json(createErrorObject(error.message));
  }

  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(error.message));
  }

  public catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction) {
    if (error instanceof BaseUserException) {
      this.logger.error(`[AuthModule] ${error.message}`, error);
      res.status(error.httpStatusCode)
        .json({
          type: 'AUTHORIZATION',
          error: error.message,
        });
    }
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    }
    return this.handleOtherError(error, req, res, next);
  }
}
