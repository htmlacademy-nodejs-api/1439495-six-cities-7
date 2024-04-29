import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    try {
      const fileReader = new TSVFileReader(filename.trim());
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error) {
      console.error(`Не удалось прочитать данные из файла ${filename}`);
      if (error instanceof Error) {
        console.error(`Детали: ${error.message}`);
      }
    }
  }
}
