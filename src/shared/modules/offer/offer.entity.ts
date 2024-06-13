import { Ref, Severity, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { OfferType, City, Amenities, Coordinates } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public description: string;

  @prop({ required: true })
  public date: Date;

  @prop({ required: true })
  public city: City;

  @prop({ required: false, default: '' })
  public previewImage: string;

  @prop({ required: true })
  public photo: string[];

  @prop({ required: true })
  public isPremium: boolean;

  @prop({ required: true })
  public type: OfferType;

  @prop({ required: true })
  public rooms: number;

  @prop({ required: true })
  public guests: number;

  @prop({ required: true })
  public price: number;

  @prop({ required: true })
  public amenities: Amenities[];

  @prop({ required: true, ref: UserEntity })
  public userId: Ref<UserEntity>;

  @prop({ required: true })
  public coordinates: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
