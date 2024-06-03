export const UserValidationMessage = {
  name: {
    invalidFormat: 'Name must be a string',
    minLength: 'Minimum name length must be 1',
    maxLength: 'Maximum name length must be 15'
  },
  mail: {
    invalid: 'Email must be a valid address'
  },
  avatar: {
    invalid: 'Avatar image must be in jpg or png'
  },
  password: {
    invalidFormat: 'Password must be a string',
    minLength: 'Minimum password length must be 6',
    maxLength: 'Maximum password length must be 12'
  },
  isPro: {
    invalid: 'It must be boolean value'
  }
};
