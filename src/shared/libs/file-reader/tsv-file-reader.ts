import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import { FileReader } from './file-reader.interface.js';
import { OfferRent, City, OfferType, Amenities } from '../../types/index.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384;

  constructor(
    private readonly filename: string
  ) {
    super();
  }

  private parseRowToOffer(row: string): OfferRent {
    const [
      name,
      description,
      date,
      city,
      previewImage,
      photo,
      isPremium,
      type,
      rooms,
      guests,
      price,
      amenities,
      userName,
      mail,
      avatar,
      password,
      isPro,
      latitude,
      longitude
    ] = row.split('\t');

    return {
      name,
      description,
      date: new Date(date),
      city: city as City,
      previewImage,
      photo: photo.split(';'),
      isPremium: isPremium === 'true',
      type: type as OfferType,
      rooms: parseInt(rooms, 10),
      guests: parseInt(guests, 10),
      price: parseInt(price, 10),
      amenities: amenities.split(';') as Amenities[],
      user: { name: userName, mail, avatar, password, isPro: isPro === 'true' },
      coordinates: { latitude, longitude }
    };
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8'
    });

    let data = '';
    let nextLinePosition = -1;

    for await (const chunk of readStream) {
      data += chunk.toString();
      nextLinePosition = data.indexOf('\n');

      while (nextLinePosition !== -1) {
        const completeRow = data.slice(0, nextLinePosition);
        data = data.slice(++nextLinePosition);

        const parsedOffer = this.parseRowToOffer(completeRow);
        await new Promise((resolve) => {
          this.emit('read', parsedOffer, resolve);
        });
        nextLinePosition = data.indexOf('\n');
      }
    }

    this.emit('finish');
  }
}
