import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { OfferRent } from '../../shared/types/index.js';
import { CommandName } from '../commands.enum.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  private onReadOffer(offer: OfferRent): void {
    console.info(offer);
  }

  public getName(): string {
    return CommandName.Import;
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    try {
      const fileReader = new TSVFileReader(filename.trim());
      fileReader.on('read', this.onReadOffer);
      fileReader.read();
    } catch (error) {
      console.error(`Не удалось прочитать данные из файла ${filename}`);
      if (error instanceof Error) {
        console.error(`Детали: ${error.message}`);
      }
    }
  }
}
