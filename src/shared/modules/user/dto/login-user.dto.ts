import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { UserValidationMessage } from './messages.js';


export class LoginUserDto {
  @IsEmail({}, { message: UserValidationMessage.mail.invalid })
  public mail: string;

  @IsString({ message: UserValidationMessage.password.invalidFormat })
  @MinLength(6, { message: UserValidationMessage.password.minLength })
  @MaxLength(12, { message: UserValidationMessage.password.maxLength })
  public password: string;
}
