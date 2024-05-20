import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ required: true })
  public text: string;

  @prop({ required: true })
  public date: Date;

  @prop({ required: true })
  public rating: number;

  @prop({ required: true, ref: UserEntity })
  public userId: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
