export const OfferValidationMessage = {
  name: {
    invalidFormat: 'Name must be a string',
    minLength: 'Minimum name length must be 10',
    maxLength: 'Maximum name length must be 100'
  },
  description: {
    invalidFormat: 'Description must be a string',
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024'
  },
  date: {
    invalidFormat: 'Date must be a valid ISO date',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  rooms: {
    invalidFormat: 'Rooms must be an integer',
    minValue: 'Minimum rooms is 1',
    maxValue: 'Maximum rooms is 8',
  },
  guests: {
    invalidFormat: 'Guests must be an integer',
    minValue: 'Minimum guests is 1',
    maxValue: 'Maximum guests is 10',
  },
  boolean: {
    invalidFormat: 'Value must be boolean',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
  image: {
    invalidFormat: 'It must be an image link',
  },
  photo: {
    invalidFormat: 'It must be 6 photo links'
  },
  type: {
    invalid: 'Type must be apartment, house, room, hotel'
  },
  city: {
    invalid: 'City must be Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf'
  },
  amenities: {
    invalid: 'Amenities must be Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge'
  },
  coordinates: {
    invalid: 'Coordinates must be an object with latitude and longitude values'
  }
};
