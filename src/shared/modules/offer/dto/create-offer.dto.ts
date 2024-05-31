import { OfferType, City, Amenities, Coordinates } from '../../../types/index.js';

export class CreateOfferDto {
  public name: string;
  public description: string;
  public date: Date;
  public city: City;
  public previewImage: string;
  public photo: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public type: OfferType;
  public rooms: number;
  public guests: number;
  public price: number;
  public amenities: Amenities[];
  public userId: string;
  public coordinates: Coordinates;
}
