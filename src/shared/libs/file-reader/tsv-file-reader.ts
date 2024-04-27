import { readFileSync } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { OfferRent, City, OfferType, Amenities } from '../../types/index.js';

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
      .filter((row) => row.trim())
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
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: parseFloat(rating),
      type: type as OfferType,
      rooms: parseInt(rooms, 10),
      guests: parseInt(guests, 10),
      price: parseInt(price, 10),
      amenities: amenities.split(';') as Amenities[],
      user: { name: userName, mail, avatar, password, isPro: isPro === 'true' },
      comments: parseInt(comments, 10),
      coordinates: { latitude, longitude}
    };
  }

  public read(): void {
    this.sourceData = readFileSync(this.filename, 'utf-8');
  }

  public toArray(): OfferRent[] {
    this.validateSourceData();
    return this.parseSourceDataToOffers();
  }
}
