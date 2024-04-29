import { Amenities } from './amenities.type.js';
import { City } from './city.type.js';
import { Coordinates } from './coordinates.type.js';
import { OfferType } from './offer-type.type.js';
import { User } from './user.type.js';

export type OfferRent = {
  name: string;
  description: string;
  date: Date;
  city: City;
  previewImage: string;
  photo: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: OfferType;
  rooms: number;
  guests: number;
  price: number;
  amenities: Amenities[];
  user: User;
  comments: number;
  coordinates: Coordinates;
}
