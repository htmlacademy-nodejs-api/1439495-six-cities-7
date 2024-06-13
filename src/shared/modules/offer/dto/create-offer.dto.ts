import { OfferType, City, Amenities, Coordinates } from '../../../types/index.js';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  Max,
  MaxLength,
  Min,
  MinLength,
  IsBoolean,
  IsString,
  Matches,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested } from 'class-validator';
import { OfferValidationMessage } from './messages.js';

export class CreateOfferDto {
  @IsString({ message: OfferValidationMessage.name.invalidFormat })
  @MinLength(10, { message: OfferValidationMessage.name.minLength })
  @MaxLength(100, { message: OfferValidationMessage.name.maxLength })
  public name: string;

  @IsString({ message: OfferValidationMessage.description.invalidFormat })
  @MinLength(20, { message: OfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: OfferValidationMessage.description.maxLength })
  public description: string;

  @IsDateString({strict: true}, { message: OfferValidationMessage.date.invalidFormat })
  public date: Date;

  @IsEnum(City, { message: OfferValidationMessage.city.invalid })
  public city: City;

  @IsArray({ message: OfferValidationMessage.photo.invalidFormat })
  @ArrayMinSize(6, { message: OfferValidationMessage.photo.invalidFormat })
  @ArrayMaxSize(6, { message: OfferValidationMessage.photo.invalidFormat })
  @Matches(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i, { each: true, message: OfferValidationMessage.photo.invalidFormat })
  public photo: string[];

  @IsBoolean({ message: OfferValidationMessage.boolean.invalidFormat })
  public isPremium: boolean;

  @IsBoolean({ message: OfferValidationMessage.boolean.invalidFormat })
  public isFavorite: boolean;

  @IsEnum(OfferType, { message: OfferValidationMessage.type.invalid })
  public type: OfferType;

  @IsInt({ message: OfferValidationMessage.rooms.invalidFormat })
  @Min(1, { message: OfferValidationMessage.rooms.minValue })
  @Max(8, { message: OfferValidationMessage.rooms.maxValue })
  public rooms: number;

  @IsInt({ message: OfferValidationMessage.guests.invalidFormat })
  @Min(1, { message: OfferValidationMessage.guests.minValue })
  @Max(10, { message: OfferValidationMessage.guests.maxValue })
  public guests: number;

  @IsInt({ message: OfferValidationMessage.price.invalidFormat })
  @Min(100, { message: OfferValidationMessage.price.minValue })
  @Max(100000, { message: OfferValidationMessage.price.maxValue })
  public price: number;

  @IsEnum(Amenities, { each: true, message: OfferValidationMessage.amenities.invalid })
  public amenities: Amenities[];

  public userId: string;

  @ValidateNested({ message: OfferValidationMessage.coordinates.invalid })
  public coordinates: Coordinates;
}
