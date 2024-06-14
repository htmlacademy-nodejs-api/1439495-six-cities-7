import UserDto from '../user/user.dto';

enum City {
  Paris = 'Paris',
  Cologne = 'Cologne',
  Brussels = 'Brussels',
  Amsterdam = 'Amsterdam',
  Hamburg = 'Hamburg',
  Dusseldorf = 'Dusseldorf'
}

enum OfferType {
  apartment = 'apartment',
  house = 'house',
  room = 'room',
  hotel = 'hotel'
}

type Coordinates = {
  latitude: string;
  longitude: string;
}

export enum Amenities {
  'Breakfast' = 'Breakfast',
  'Air conditioning' = 'Air conditioning',
  'Laptop friendly workspace' = 'Laptop friendly workspace',
  'Baby seat' = 'Baby seat',
  'Washer' = 'Washer',
  'Towels' = 'Towels',
  'Fridge' = 'Fridge'
}

export default class OfferDto {
  public id!: string;
  public name!: string;
  public date!: Date;
  public city!: City;
  public previewImage!: string;
  public isPremium!: boolean;
  public isFavorite!: boolean;
  public rating!: number;
  public type!: OfferType;
  public price!: number;
  public coordinates!: Coordinates;
  public description!: string;
  public photo!: string[];
  public commentCount!: number;
  public rooms!: number;
  public guests!: number;
  public amenities!: Amenities[];
  public user!: UserDto;
}
