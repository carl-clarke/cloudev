import { Command, flags } from '@oclif/command';

export default class Clone extends Command {
  static description = '[Coming Soon] Create a duplicate of your workspace.'

  static aliases = [];

  static examples = [
    `$ cloudev clone <name>
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // all: flags.string({char: 'a', description: ''}),
  }

  static args = [{ name: 'name' }];

  async run() {
    const { args } = this.parse(Clone);

    this.log('Coming soon');
    // cli.action.start('Stopping');

    // const { success } = await stop(args.name);

    // cli.action.stop(`${success ? chalk.greenBright('done') : chalk.red('failed')}`);
  }
}
