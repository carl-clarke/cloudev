import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import { stop } from '../services/agent';

export default class Start extends Command {
  static description = 'Stop an active workspace. Can be restarted later to pickup where you left off.'

  static aliases = [];

  static examples = [
    `$ cloudev stop <name>
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // all: flags.string({char: 'a', description: ''}),
  }

  static args = [{ name: 'name' }];

  async run() {
    const { args } = this.parse(Start);

    cli.action.start('Stopping');

    const { success } = await stop(args.name);

    cli.action.stop(`${success ? '✔️ done!' : '❌ failed'}`);
  }
}
