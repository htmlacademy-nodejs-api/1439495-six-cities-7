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
  ValidateNested,
  IsOptional} from 'class-validator';
import { OfferValidationMessage } from './messages.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: OfferValidationMessage.name.invalidFormat })
  @MinLength(10, { message: OfferValidationMessage.name.minLength })
  @MaxLength(100, { message: OfferValidationMessage.name.maxLength })
  public name?: string;

  @IsOptional()
  @IsString({ message: OfferValidationMessage.description.invalidFormat })
  @MinLength(20, { message: OfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: OfferValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsDateString({strict: true}, { message: OfferValidationMessage.date.invalidFormat })
  public date?: Date;

  @IsOptional()
  @IsEnum(City, { message: OfferValidationMessage.city.invalid })
  public city?: City;

  @IsOptional()
  @Matches(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i, { message: OfferValidationMessage.image.invalidFormat })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: OfferValidationMessage.photo.invalidFormat })
  @ArrayMinSize(6, { message: OfferValidationMessage.photo.invalidFormat })
  @ArrayMaxSize(6, { message: OfferValidationMessage.photo.invalidFormat })
  @Matches(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i, { each: true, message: OfferValidationMessage.photo.invalidFormat })
  public photo?: string[];

  @IsOptional()
  @IsBoolean({ message: OfferValidationMessage.boolean.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean({ message: OfferValidationMessage.boolean.invalidFormat })
  public isFavorite?: boolean;

  @IsOptional()
  @IsEnum(OfferType, { message: OfferValidationMessage.type.invalid })
  public type?: OfferType;

  @IsOptional()
  @IsInt({ message: OfferValidationMessage.rooms.invalidFormat })
  @Min(1, { message: OfferValidationMessage.rooms.minValue })
  @Max(8, { message: OfferValidationMessage.rooms.maxValue })
  public rooms?: number;

  @IsOptional()
  @IsInt({ message: OfferValidationMessage.guests.invalidFormat })
  @Min(1, { message: OfferValidationMessage.guests.minValue })
  @Max(10, { message: OfferValidationMessage.guests.maxValue })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: OfferValidationMessage.price.invalidFormat })
  @Min(100, { message: OfferValidationMessage.price.minValue })
  @Max(100000, { message: OfferValidationMessage.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsEnum(Amenities, { each: true, message: OfferValidationMessage.amenities.invalid })
  public amenities?: Amenities[];

  @IsOptional()
  @ValidateNested({ message: OfferValidationMessage.coordinates.invalid })
  public coordinates?: Coordinates;
}
