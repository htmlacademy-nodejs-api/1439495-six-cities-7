import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { Controller } from '../shared/libs/rest/controller/index.js';
import { ExceptionFilter } from '../shared/libs/rest/exception-filter/index.js';

@injectable()
export class RestApplication {
  private readonly server: Express = express();

  constructor (
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.UserController) private readonly userController: Controller,
    @inject(Component.CommentController) private readonly commentController: Controller,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.AuthExceptionFilter) private readonly authExceptionFilter: ExceptionFilter,
  ) {}

  private initDb() {
    const mongoUri = getMongoURI({
      username: this.config.get('DB_USER'),
      password: this.config.get('DB_PASSWORD'),
      host: this.config.get('DB_HOST'),
      port: this.config.get('DB_PORT'),
      databaseName: this.config.get('DB_NAME')
    });

    return this.databaseClient.connect(mongoUri);
  }

  private async initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async initControllers() {
    this.server.use('/offers', this.offerController.router);
    this.server.use('/users', this.userController.router);
    this.server.use('/comments', this.commentController.router);
  }

  private async initMiddlewares() {
    this.server.use(express.json());
    this.server.use('/uploads', express.static(this.config.get('UPLOAD_DIRECTORY')));
  }

  private async initExceptionFilters() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialized');

    await this.initDb();

    await this.initMiddlewares();

    await this.initControllers();
    this.logger.info('Controller initialization completed');

    await this.initExceptionFilters();

    await this.initServer();
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
