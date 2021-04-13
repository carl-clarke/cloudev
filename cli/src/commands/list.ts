import { Command, flags } from '@oclif/command';
import chalk from 'chalk';
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

    const { success, data: results, errors } = await list();

    cli.action.stop(`${success ? chalk.greenBright('done') : chalk.red('failed')}`);

    if (success) {
      const data = results
        .sort((a, b) => a.state === AgentContainerState.Running ? -1 : 1);

      cli.table(data, {
        status: {
          minWidth: 10,
          get: p => p.state === AgentContainerState.Running ? '🟢 Up' : '⭕ Down'
        },
        name: {
          minWidth: 15
        },
        memory: {
          get: ({ memory }) => `${memory.usage} (${memory.percentage})`
        }
      });
    } else {
      this.log(errors.join('\n'));
    }
  }
}
