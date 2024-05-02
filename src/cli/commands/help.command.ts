import chalk from 'chalk';
import { Command } from './command.interface.js';
import { CommandName } from '../commands.enum.js';


export class HelpCommand implements Command {
  public getName(): string {
    return CommandName.Help;
  }

  public execute(..._parameters: string[]): void {
    console.info(`
      Программа для подготовки данных для REST API сервера.

      Пример: ${chalk.green('cli.js --<command> [--arguments]')}

      Команды:

      ${chalk.blue(CommandName.Version)}:                   ${chalk.red('# выводит номер версии')}
      ${chalk.blue(CommandName.Help)}:                      ${chalk.red('# печатает этот текст')}
      ${chalk.blue(CommandName.Import)} <path>:             ${chalk.red('# импортирует данные из TSV')}
      ${chalk.blue(CommandName.Generate)} <n> <path> <url>  ${chalk.red('# генерирует произвольное количество тестовых данных')}
    `);
  }
}
