import { CityLocation, UserType } from '../const';
import OfferDto from '../dto/offer/offer.dto';
import UserDto from '../dto/user/user.dto';
import { City, Offer, User } from '../types/types';


export const adaptOffersToClient = (offers: OfferDto[]): Offer[] => {
  const newOffers = offers.map((offer) => ({
    id: offer.id,
    price: offer.price,
    rating: offer.rating,
    title: offer.name,
    isPremium: offer.isPremium,
    isFavorite: offer.isFavorite,
    city: {
      name: offer.city,
      location: CityLocation[offer.city]
    } as City,
    location: offer.coordinates,
    previewImage: offer.previewImage,
    type: offer.type,
    bedrooms: offer.rooms,
    description: offer.description,
    goods: offer.amenities,
    host: adaptUserToClient(offer.user),
    images: offer.photo,
    maxAdults: offer.guests
  } as unknown));
  return newOffers as Offer[];
};

export const adaptUserToClient = (user: UserDto): User => ({
  name: user.name,
  avatarUrl: user.avatar,
  type: user.isPro ? UserType.Pro : UserType.Regular,
  email: user.mail
});
