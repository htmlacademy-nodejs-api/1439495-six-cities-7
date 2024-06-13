import { inject, injectable } from 'inversify';
import { DEFAULT_STATIC_IMAGES, STATIC_RESOURCE_FIELDS } from './path-transformer.const.js';
import { Component } from '../../../types/index.js';
import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from '../../../../rest/index.js';
import { getFullServerPath } from '../../../helpers/index.js';
import { Config, RestSchema } from '../../config/index.js';

function isObject(value: unknown): value is Record<string, object> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

@injectable()
export class PathTransformer {
  constructor(
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {}

  private hasDefaultImage(value: string) {
    return DEFAULT_STATIC_IMAGES.includes(value);
  }

  private isStaticProperty(property: string) {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  public execute(data: Record<string, unknown>): Record<string, unknown> {
    const stack = [data];
    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current) {
        if (Object.hasOwn(current, key)) {
          const value = current[key];

          if (isObject(value)) {
            stack.push(value);
            continue;
          }

          if (typeof value === 'string' && this.isStaticProperty(key)) {
            const rootPath = this.hasDefaultImage(value) ? STATIC_FILES_ROUTE : STATIC_UPLOAD_ROUTE;
            current[key] = `${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}${rootPath}/${value}`;
          }
        }
      }
    }
    return data;
  }
}
