import { WriteStream, createWriteStream } from 'node:fs';
import { FileWriter } from './index.js';

export class TSVFileWriter implements FileWriter {
  private stream: WriteStream;

  constructor(filename: string) {
    this.stream = createWriteStream(filename, {
      flags: 'w',
      encoding: 'utf-8',
      autoClose: true
    });
  }

  public async write(row: string): Promise<unknown> {
    if (!this.stream.write(`${row}\n`)) {
      return new Promise((resolve) => this.stream.once('drain', () => resolve(true)));
    }
    return Promise.resolve();
  }
}
