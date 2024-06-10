import { getMongoURI } from '../../shared/helpers/index.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { PinoLogger } from '../../shared/libs/logger/index.js';
import { DefaultOfferService, OfferModel } from '../../shared/modules/offer/index.js';
import { DefaultUserService, UserModel } from '../../shared/modules/user/index.js';
import { OfferRent } from '../../shared/types/index.js';
import { CommandName } from '../commands.enum.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  private logger = new PinoLogger();
  private userService = new DefaultUserService(this.logger, UserModel);
  private offerService = new DefaultOfferService(this.logger, OfferModel, UserModel);
  private databaseClient = new MongoDatabaseClient(this.logger);
  private salt = 'secret string';

  constructor() {
    this.onReadOffer = this.onReadOffer.bind(this);
    this.onFinishReadOffers = this.onFinishReadOffers.bind(this);
  }

  private async onReadOffer(offer: OfferRent, resolve: () => void) {
    await this.saveOffer(offer);
    resolve();
  }

  private onFinishReadOffers() {
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: OfferRent) {
    const user = await this.userService.findOrCreate({...offer.user}, this.salt);

    await this.offerService.create({
      name: offer.name,
      description: offer.description,
      date: offer.date,
      city: offer.city,
      previewImage: offer.previewImage,
      photo: offer.photo,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      type: offer.type,
      rooms: offer.rooms,
      guests: offer.guests,
      price: offer.price,
      amenities: offer.amenities,
      userId: user.id,
      coordinates: offer.coordinates,
    });
  }

  public getName(): string {
    return CommandName.Import;
  }

  public async execute(filename: string, login: string, password: string, host: string, port: string, dbname: string): Promise<void> {
    const uri = getMongoURI({
      username: login,
      password,
      host,
      port: +port,
      databaseName: dbname
    });
    await this.databaseClient.connect(uri);

    try {
      const fileReader = new TSVFileReader(filename.trim());
      fileReader.on('read', this.onReadOffer);
      fileReader.on('finish', this.onFinishReadOffers);
      fileReader.read();
    } catch (error) {
      console.error(`Не удалось прочитать данные из файла ${filename}`);
      if (error instanceof Error) {
        console.error(`Детали: ${error.message}`);
      }
    }
  }
}
