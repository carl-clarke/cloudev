import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import { start } from '../services/agent';

export default class Start extends Command {
  static description = 'Start a previously stopped workspace.'

  static aliases = [];

  static examples = [
    `$ cloudev start <name>
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // all: flags.string({char: 'a', description: ''}),
  }

  static args = [{ name: 'name' }];

  async run() {
    const { args } = this.parse(Start);

    cli.action.start('Starting');

    const { success } = await start(args.name);

    cli.action.stop(`${success ? '✔️ done' : '❌ failed'}`);
  }
}
