import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import { AgentContainerState, list } from '../services/agent';

export default class List extends Command {
  static description = 'List all your DEV workspaces'

  static aliases = ['ls'];

  static examples = [];

  static flags = {
    help: flags.help({ char: 'h' }),
    // all: flags.string({char: 'a', description: ''}),
  }

  static args = [];

  async run() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { args, flags } = this.parse(List);

    cli.action.start('Fetching');

    const { success, data: results } = await list();

    cli.action.stop(`${success ? '✔️ done!' : '❌ failed'}`);

    results.forEach(p => {
      const isRunning = p.state === AgentContainerState.Running;
      const { usage, percentage } = p.memory;

      this.log(`${isRunning ? '🟢' : '⭕'} ${p.name}\t${p.state}${usage && `\t${usage} (${percentage})`}`);
    });
  }
}
