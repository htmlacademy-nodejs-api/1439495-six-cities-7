import { Severity, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ required: true })
  public name: string;

  @prop({ unique: true, required: true })
  public mail: string;

  @prop({ required: false, default: 'https://15.design.htmlacademy.pro/static/avatar/6.jpg' })
  public avatar: string;

  @prop({ required: true })
  public password: string;

  @prop({ required: true })
  public isPro: boolean;

  @prop({ required: false, default: [] })
  public favoriteOffersId: string[];

  constructor(userData: User) {
    super();

    this.name = userData.name;
    this.mail = userData.mail;
    this.avatar = userData.avatar;
    this.isPro = userData.isPro;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
