import { Command, flags } from '@oclif/command';

export default class Share extends Command {
  static description = '[Coming Soon] Share a copy of your workspace with someone else.'

  static aliases = [];

  static examples = [
    `$ cloudev share <name> <recipient>
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // all: flags.string({char: 'a', description: ''}),
  }

  static args = [{ name: 'name' }, { name: 'recipient' }];

  async run() {
    const { args } = this.parse(Share);

    this.log('Coming soon');
    // cli.action.start('Stopping');

    // const { success } = await stop(args.name);

    // cli.action.stop(`${success ? chalk.greenBright('done') : chalk.red('failed')}`);
  }
}
