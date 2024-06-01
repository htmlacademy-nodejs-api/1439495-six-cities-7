import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/index.js';

export class CommentRdo {
  @Expose()
  public text: string;

  @Expose()
  public rating: number;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose({ name: 'createdAt'})
  public date: string;
}
