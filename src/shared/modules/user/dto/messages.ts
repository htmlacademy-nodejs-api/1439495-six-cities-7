import { UserValidationRequirement } from './validation-requirement.enum.js';

export const UserValidationMessage = {
  name: {
    invalidFormat: 'Name must be a string',
    minLength: `Minimum name length must be ${UserValidationRequirement.NameMinLength}`,
    maxLength: `Maximum name length must be ${UserValidationRequirement.NameMaxLength}`
  },
  mail: {
    invalid: 'Email must be a valid address'
  },
  avatar: {
    invalid: 'Avatar image must be in jpg or png'
  },
  password: {
    invalidFormat: 'Password must be a string',
    minLength: `Minimum password length must be ${UserValidationRequirement.PasswordMinLength}`,
    maxLength: `Maximum password length must be ${UserValidationRequirement.PasswordMaxLength}`
  },
  isPro: {
    invalid: 'It must be boolean value'
  }
};
