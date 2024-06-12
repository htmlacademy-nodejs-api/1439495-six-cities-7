import { IsInt, IsString, MinLength, MaxLength, Min, Max, IsMongoId } from 'class-validator';
import { CommentValidationMessage } from './messages.js';

export class CreateCommentDto {
  @IsString({ message: CommentValidationMessage.text.invalidFormat })
  @MinLength(5, { message: CommentValidationMessage.text.minLength })
  @MaxLength(1024, { message: CommentValidationMessage.text.maxLength })
  public text: string;

  @IsInt({ message: CommentValidationMessage.rating.invalidFormat })
  @Min(1, { message: CommentValidationMessage.rating.minValue })
  @Max(5, { message: CommentValidationMessage.rating.maxValue })
  public rating: number;

  public userId: string;

  @IsMongoId({ message: CommentValidationMessage.offerId.invalidId })
  public offerId: string;
}
