import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Middleware } from './index.js';
import { ValidationError } from '../errors/index.js';
import { reduceValidationErrors } from '../../../helpers/index.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(
    private dto: ClassConstructor<object>
  ) {}

  public async execute({ body, path }: Request, _res: Response, next: NextFunction): Promise<void> {
    const instance = plainToInstance(this.dto, body);
    const errors = await validate(instance);

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: ${path}`, reduceValidationErrors(errors));
    }

    next();
  }
}
