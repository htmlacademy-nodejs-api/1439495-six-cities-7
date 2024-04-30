import dayjs from 'dayjs';
import { getRandomItem, generateRandomValue, getRandomArray, getRandomBooleanValue } from '../../helpers/index.js';
import { MockServerData } from '../../types/index.js';
import { OfferGenerator } from './index.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;
const IMAGES_IN_OFFER = 6;
const MAX_ROOMS = 8;
const MAX_GUESTS = 10;
const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const COUNT_AMENITIES_IN_OFFER = 3;
const MAX_COMMENTS_NUMBER = 20;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(
    private readonly mockData: MockServerData
  ) {}

  public generate(): string {
    const name = getRandomItem(this.mockData.names);
    const description = getRandomItem(this.mockData.descriptions);
    const date = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day');
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.images);
    const photo = getRandomArray<string>(this.mockData.images, IMAGES_IN_OFFER).join(';');
    const isPremium = getRandomBooleanValue();
    const isFavorite = getRandomBooleanValue();
    const rating = generateRandomValue(1, 5);
    const type = getRandomItem(this.mockData.types);
    const rooms = generateRandomValue(1, MAX_ROOMS);
    const guests = generateRandomValue(1, MAX_GUESTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const amenities = getRandomArray<string>(this.mockData.amenities, COUNT_AMENITIES_IN_OFFER).join(';');
    const userName = getRandomItem(this.mockData.usernames);
    const mail = getRandomItem(this.mockData.emails);
    const avatar = getRandomItem(this.mockData.avatars);
    const password = getRandomItem(this.mockData.passwords);
    const isPro = getRandomBooleanValue();
    const comments = generateRandomValue(0, MAX_COMMENTS_NUMBER);
    const [latitude, longitude] = getRandomItem(this.mockData.coordinates).split(' ');

    return [
      name, description, date, city, previewImage, photo,
      isPremium, isFavorite, rating, type, rooms, guests,
      price, amenities, userName, mail, avatar, password,
      isPro, comments, latitude, longitude
    ].join('\t');
  }
}
