import { CommandParser } from './command-parser.js';
import { Command } from './commands/command.interface.js';

type CommandCollection = Record<string, Command>;

export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = '--help'
  ) {}

  public registerCommands(commandsList: Command[]): void {
    commandsList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Команда ${command.getName()} уже зарегистрирована`);
      }
      this.commands[command.getName()] = command;
    });
  }

  public getCommand(name: string): Command {
    return this.commands[name] ?? this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [name] = Object.keys(parsedCommand);
    const command = this.getCommand(name);
    const commandArguments = parsedCommand[name] ?? [];
    command.execute(...commandArguments);
  }
}
