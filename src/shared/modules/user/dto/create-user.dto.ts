import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches, IsBoolean } from 'class-validator';
import { UserValidationMessage } from './messages.js';

export class CreateUserDto {
  @IsString({ message: UserValidationMessage.name.invalidFormat })
  @MinLength(1, { message: UserValidationMessage.name.minLength })
  @MaxLength(15, { message: UserValidationMessage.name.maxLength })
  public name: string;

  @IsEmail({}, { message: UserValidationMessage.mail.invalid })
  public mail: string;

  @IsOptional()
  @Matches(/\.(jpe?g|png)$/i, { message: UserValidationMessage.avatar.invalid })
  public avatar: string;

  @IsString({ message: UserValidationMessage.password.invalidFormat })
  @MinLength(6, { message: UserValidationMessage.password.minLength })
  @MaxLength(12, { message: UserValidationMessage.password.maxLength })
  public password: string;

  @IsBoolean({ message: UserValidationMessage.isPro.invalid })
  public isPro: boolean;
}
