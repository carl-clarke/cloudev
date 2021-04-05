import { Command, flags } from '@oclif/command';
import chalk from 'chalk';
import cli from 'cli-ux';
import shelljs from 'shelljs';
import { sshAddConfig } from '../modules/core';
import { create } from '../services/agent';
export default class Create extends Command {
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
    const { args } = this.parse(Create);
    const { name } = args;
    // const user = await getCreds();

    cli.action.start(`Creating ${name}`);

    const { success, data: { port, key } } = await create(name);

    cli.action.stop(`${success ? chalk.greenBright('done') : chalk.red('failed')}`);

    if (success) {
      const { host } = await sshAddConfig(name, key, port);

      this.log(chalk.yellowBright('You will now be connected to the instance to choose a new password. Default password is "dev".'));
      cli.wait(3000);

      shelljs.exec(`ssh -tt ${host}`);

      this.log(chalk.blue(`Open VSCode and use the Remote Explorer to connect to ${chalk.yellowBright(name)}`));

      // await cli.url('Open VSCode', `vscode://file/${name}.cloudev`);
    }
  }
}
