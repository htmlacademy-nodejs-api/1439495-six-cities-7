import chalk from 'chalk';
import { CommandParser } from './command-parser.js';
import { Command } from './commands/command.interface.js';
import { CommandName } from './commands.enum.js';

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};
  private readonly defaultCommand: string = CommandName.Help;

  public registerCommands(commandsList: Command[]): void {
    commandsList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Команда ${command.getName()} уже зарегистрирована`);
      }
      this.commands[command.getName()] = command;
    });
  }

  public getCommand(name: string): Command {
    if (!this.commands[name]) {
      console.info(chalk.red.bold(`Команды ${name} не существует.`));
      return this.commands[this.defaultCommand];
    }
    return this.commands[name];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [name] = Object.keys(parsedCommand);
    const command = this.getCommand(name);
    const commandArguments = parsedCommand[name] ?? [];
    command.execute(...commandArguments);
  }
}
