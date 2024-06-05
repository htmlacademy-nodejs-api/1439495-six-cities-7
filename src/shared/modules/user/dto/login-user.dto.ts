import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { UserValidationMessage } from './messages.js';
import { UserValidationRequirement } from './validation-requirement.enum.js';


export class LoginUserDto {
  @IsEmail({}, { message: UserValidationMessage.mail.invalid })
  public mail: string;

  @IsString({ message: UserValidationMessage.password.invalidFormat })
  @MinLength(UserValidationRequirement.PasswordMinLength, { message: UserValidationMessage.password.minLength })
  @MaxLength(UserValidationRequirement.PasswordMaxLength, { message: UserValidationMessage.password.maxLength })
  public password: string;
}
