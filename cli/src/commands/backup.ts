import { Command, flags } from '@oclif/command';

export default class Backup extends Command {
  static description = '[Coming Soon] Save snapshot your workspace which can be restored later.'

  static aliases = [];

  static examples = [
    `$ cloudev backup <name> <description>
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // all: flags.string({char: 'a', description: ''}),
  }

  static args = [{ name: 'name' }, { name: 'description' }];

  async run() {
    const { args } = this.parse(Backup);

    this.log('Coming soon');
    // cli.action.start('Stopping');

    // const { success } = await stop(args.name);

    // cli.action.stop(`${success ? chalk.greenBright('done') : chalk.red('failed')}`);
  }
}
