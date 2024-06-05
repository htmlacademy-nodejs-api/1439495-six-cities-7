import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches, IsBoolean } from 'class-validator';
import { UserValidationMessage } from './messages.js';
import { UserValidationRequirement } from './validation-requirement.enum.js';

export class CreateUserDto {
  @IsString({ message: UserValidationMessage.name.invalidFormat })
  @MinLength(UserValidationRequirement.NameMinLength, { message: UserValidationMessage.name.minLength })
  @MaxLength(UserValidationRequirement.NameMaxLength, { message: UserValidationMessage.name.maxLength })
  public name: string;

  @IsEmail({}, { message: UserValidationMessage.mail.invalid })
  public mail: string;

  @IsOptional()
  @Matches(/\.(jpe?g|png)$/i, { message: UserValidationMessage.avatar.invalid })
  public avatar: string;

  @IsString({ message: UserValidationMessage.password.invalidFormat })
  @MinLength(UserValidationRequirement.PasswordMinLength, { message: UserValidationMessage.password.minLength })
  @MaxLength(UserValidationRequirement.PasswordMaxLength, { message: UserValidationMessage.password.maxLength })
  public password: string;

  @IsBoolean({ message: UserValidationMessage.isPro.invalid })
  public isPro: boolean;
}
