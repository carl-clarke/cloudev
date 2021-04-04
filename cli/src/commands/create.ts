import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import { promises as fs } from 'fs';
import { homedir } from 'os';
import * as path from 'path';
import { getHost } from '../modules/core';
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
    const host = await getHost();
    const CLOUDEV_SSH_DIR = '.cloudev';
    const sshDir = path.join(homedir(), '.ssh', CLOUDEV_SSH_DIR);
    const keyFile = path.join(sshDir, name);
    const configFile = path.join(sshDir, 'config');

    cli.action.start(`Creating ${name}`);

    const { success, data } = await create(name);

    cli.action.stop(`${success ? '✔️ done!' : '❌ failed'}`);

    try {
      await fs.access(sshDir);
    } catch {
      await fs.mkdir(sshDir, { recursive: true });
    }

    await fs.writeFile(`${keyFile}`, data.key);
    await fs.chmod(keyFile, 600);
    await fs.appendFile(configFile, `
Host "${name}.cloudev"
  HostName ${host.ip}
  Port ${data.port}
  IdentityFile ${keyFile}
  User dev
`);

    // this.log('Open ')
    await cli.url('Open VSCode', `vscode://file/${name}.cloudev`);
  }
}
