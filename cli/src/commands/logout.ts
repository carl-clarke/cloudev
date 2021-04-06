import { Command, flags } from '@oclif/command';
import chalk from 'chalk';
import cli from 'cli-ux';
import { deleteToken } from '../modules/core';

export default class Logout extends Command {
  static description = 'Start a previously stopped workspace.'

  static aliases = [];

  static examples = [
    `$ cloudev logout
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [{ name: 'name' }];

  async run() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { args, flags } = this.parse(Logout);

    cli.action.start('Logging out');

    let success = false;
    try {
      await deleteToken();
      success = true;
    } catch { }

    cli.action.stop();

    if (success) {
      this.log(chalk.yellowBright('Logout was successful!'));
    } else {
      this.log(chalk.red('Login failed! Please try again.'));
    }
  }
}
