import chalk from 'chalk';
import { Command } from './command.interface.js';


export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
      Программа для подготовки данных для REST API сервера.

      Пример: ${chalk.green('cli.js --<command> [--arguments]')}

      Команды:

      ${chalk.blue('--version')}:                   ${chalk.red('# выводит номер версии')}
      ${chalk.blue('--help')}:                      ${chalk.red('# печатает этот текст')}
      ${chalk.blue('--import')} <path>:             ${chalk.red('# импортирует данные из TSV')}
      ${chalk.blue('--generate')} <n> <path> <url>  ${chalk.red('# генерирует произвольное количество тестовых данных')}
    `);
  }
}
