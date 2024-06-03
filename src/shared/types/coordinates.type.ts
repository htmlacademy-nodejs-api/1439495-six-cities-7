/*export type Coordinates = {
  latitude: string;
  longitude: string;
}*/
import { IsLatitude, IsLongitude } from 'class-validator';

export class Coordinates {
  @IsLatitude()
  public latitude: string;

  @IsLongitude()
  public longitude: string;
}
