export const CommentValidationMessage = {
  text: {
    invalidFormat: 'Text must be a string',
    minLength: 'Minimum text length must be 5',
    maxLength: 'Maximum text length must be 1024'
  },
  rating: {
    invalidFormat: 'Rating must be an integer',
    minValue: 'Minimum rating is 1',
    maxValue: 'Maximum rating is 5',
  },
  userId: {
    invalidId: 'userId field must be a valid id'
  },
  offerId: {
    invalidId: 'offerId field must be a valid id'
  }
};
