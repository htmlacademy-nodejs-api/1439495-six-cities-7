import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';
import { Command } from './command.interface.js';
import { CommandName } from '../commands.enum.js';


export class VersionCommand implements Command {
  private readonly filePath: string = 'package.json';

  private readVersion(): string {
    const fileContent = JSON.parse(readFileSync(resolve(this.filePath), 'utf-8'));
    return fileContent.version;
  }

  public getName(): string {
    return CommandName.Version;
  }

  public execute(..._parameters: string[]): void {
    try {
      const version = this.readVersion();
      console.info(chalk.blue(version));
    } catch (error) {
      console.error(`Ошибка чтения версии программы из файла ${this.filePath}`);
    }
  }
}
