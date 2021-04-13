import { Command, flags } from '@oclif/command';
import chalk from 'chalk';
import cli from 'cli-ux';
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

    const { success, data: { port, key }, errors } = await create(name);

    cli.action.stop(`${success ? chalk.greenBright('done') : chalk.red('failed')}`);

    if (success) {
      const { host } = await sshAddConfig(name, key, port);
      const accent = chalk.yellowBright;

      this.log(accent('You\'re almost ready to go:'));
      this.log(`1. Connect using the command ${accent(`ssh ${host}`)} and change the default password "${accent('dev')}"`);
      this.log(`2. Open ${accent('VSCode')} and use the ${accent('Remote Explorer')} to access ${accent(host)}`);
      
      //You will now be connected to the workspace to choose a new password. Default password is "dev".'));
      // await cli.wait(3000);

      // shelljs.exec(`ssh -tt ${host}`);


      // await cli.url('Open VSCode', `vscode://file/${name}.cloudev`);
    } else {
      this.log(errors.join('\n'));
    }
  }
}
