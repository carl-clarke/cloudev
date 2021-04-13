import { Command, flags } from '@oclif/command';
import chalk from 'chalk';
import cli from 'cli-ux';
import { stop } from '../services/agent';

export default class Stop extends Command {
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
    const { args } = this.parse(Stop);

    cli.action.start('Stopping');

    const { success } = await stop(args.name);

    cli.action.stop(`${success ? chalk.greenBright('done') : chalk.red('failed')}`);
  }
}
