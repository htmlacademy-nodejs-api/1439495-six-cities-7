import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/component.enum.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { Controller } from '../shared/libs/rest/controller/index.js';

@injectable()
export class RestApplication {
  private readonly server: Express = express();

  constructor (
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferController) private readonly offerController: Controller,
    @inject(Component.UserController) private readonly userController: Controller
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
  }

  private async initMiddleware() {
    this.server.use(express.json());
  }

  public async init() {
    this.logger.info('Application initialized');

    await this.initDb();

    await this.initMiddleware();

    await this.initControllers();
    this.logger.info('Controller initialization completed');

    await this.initServer();
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
