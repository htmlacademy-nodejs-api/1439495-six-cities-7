import { Amenities, City, OfferType } from './index.js';

export type MockServerData = {
  names: string[];
  descriptions: string[];
  cities: City[];
  images: string[];
  types: OfferType[];
  amenities: Amenities[];
  usernames: string[];
  emails: string[];
  passwords: string[];
  avatars: string[];
  coordinates: string[];
};
