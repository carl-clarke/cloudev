import { Command, flags } from '@oclif/command';

export default class Restore extends Command {
  static description = '[Coming Soon] Restore your workspace to a prior point in time from snapshot.'

  static aliases = [];

  static examples = [
    `$ cloudev restore <name>
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // all: flags.string({char: 'a', description: ''}),
  }

  static args = [{ name: 'name' }];

  async run() {
    const { args } = this.parse(Restore);

    this.log('Coming soon');
    // cli.action.start('Stopping');

    // const { success } = await stop(args.name);

    // cli.action.stop(`${success ? chalk.greenBright('done') : chalk.red('failed')}`);
  }
}
