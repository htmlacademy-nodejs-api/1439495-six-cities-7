import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { OfferRent } from '../../types/offer-rent.type.js';
import { City } from '../../types/city.type.js';
import { OfferType } from '../../types/offer-type.type.js';
import { Amenities } from '../../types/amenities.type.js';
import { User } from '../../types/user.type.js';
import { Coordinates } from '../../types/coordinates.type.js';


export class TSVFileReader implements FileReader {
  private sourceData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateSourceData(): void {
    if (!this.sourceData) {
      throw new Error('Нет данных');
    }
  }

  private parseSourceDataToOffers(): OfferRent[] {
    return this.sourceData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((row) => this.parseRowToOffer(row));
  }

  private parseRowToOffer(row: string): OfferRent {
    const [
      name,
      description,
      date,
      city,
      previewImage,
      photo,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      amenities,
      userName,
      mail,
      avatar,
      password,
      isPro,
      comments,
      latitude,
      longitude
    ] = row.split('\t');

    return {
      name,
      description,
      date: new Date(date),
      city: city as City,
      previewImage,
      photo: photo.split(';'),
      isPremium: !!isPremium,
      isFavorite: !!isFavorite,
      rating: this.parseToNumber(rating),
      type: type as OfferType,
      rooms: this.parseToNumber(rooms),
      guests: this.parseToNumber(guests),
      price: this.parseToNumber(price),
      amenities: amenities.split(';') as Amenities[],
      user: this.parseUser(userName, mail, avatar, password, isPro),
      comments: this.parseToNumber(comments),
      coordinates: this.parseCoordinates(latitude, longitude)
    };
  }

  private parseToNumber(string: string): number {
    return Number.parseInt(string, 10);
  }

  private parseUser(name: string, mail: string, avatar: string, password: string, isPro: string): User {
    return { name, mail, avatar, password, isPro: !!isPro };
  }

  private parseCoordinates(latitude: string, longitude: string): Coordinates {
    return { latitude, longitude};
  }

  public read(): void {
    this.sourceData = readFileSync(this.filename, 'utf-8');
  }

  public toArray(): OfferRent[] {
    this.validateSourceData();
    return this.parseSourceDataToOffers();
  }
}
