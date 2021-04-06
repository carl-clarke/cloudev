import { Command, flags } from '@oclif/command';
import chalk from 'chalk';
import cli from 'cli-ux';
import { sshRemoveConfig } from '../modules/core';
import { remove } from '../services/agent';

export default class Remove extends Command {
  static description = 'Permanently delete a workspace. All apps and data - except those stored in your cloud-drive - will be removed.'

  static aliases = ['rm'];

  static examples = [
    `$ cloudev remove <name>
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // all: flags.string({char: 'a', description: ''}),
  }

  static args = [{ name: 'name' }];

  async run() {
    const { args } = this.parse(Remove);
    const { name } = args;

    cli.action.start('Removing');

    const { success, errors } = await remove(name);

    if (success) {
      await sshRemoveConfig(name);
    } else {
      this.log(errors.join('\n'));
    }

    cli.action.stop(`${success ? chalk.greenBright('done') : chalk.red('failed')}`);
  }
}
