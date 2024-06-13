import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Logger } from '../../logger/index.js';
import { ApplicationError, Component } from '../../../types/index.js';
import { HttpError, ValidationError } from '../errors/index.js';
import { createErrorObject } from '../../../helpers/index.js';
import { BaseUserException } from '../../../modules/auth/errors/index.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {}

  private handleHttpError(error: HttpError, req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[HttpErrorException]: ${req.path} # ${error.message}`, error);
    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }

  private handleValidationError(error: ValidationError, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[ValidationException]: ${error.message}`, error);
    error.details.forEach(
      (errorField) => this.logger.warn(`[${errorField.property}] — ${errorField.messages}`)
    );
    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.ValidationError, error.message, error.details));
  }

  private handleOtherError(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(error.message, error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ApplicationError.ServiceError, error.message));
  }

  private handleAuthorizationError(error: BaseUserException, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[AuthModule] ${error.message}`, error);
    res.status(error.httpStatusCode)
      .json({
        type: 'AUTHORIZATION',
        error: error.message,
      });
  }

  public catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction) {
    if (error instanceof BaseUserException) {
      return this.handleAuthorizationError(error, req, res, next);
    }

    if (error instanceof ValidationError) {
      return this.handleValidationError(error, req, res, next);
    }

    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    }

    return this.handleOtherError(error, req, res, next);
  }
}
