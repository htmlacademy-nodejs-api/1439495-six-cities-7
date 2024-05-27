import { Expose } from 'class-transformer';
import { City, Coordinates, OfferType } from '../../../types/index.js';

export class OfferRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public date: Date;

  @Expose()
  public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: OfferType;

  @Expose()
  public price: number;

  @Expose()
  public coordinates: Coordinates;
}
