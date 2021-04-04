import { Command, flags } from '@oclif/command';
import cli from 'cli-ux';
import { AgentContainerState } from '../services/agent';

export default class Hello extends Command {
  static description = 'describe the command here'

  static aliases = ['ls'];

  static examples = [
    `$ cloudev start <name>
`,
  ];

  static flags = {
    help: flags.help({char: 'h'}),
    // all: flags.string({char: 'a', description: ''}),
  }

  static args = [{name: 'Container name'}];

  async run() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {args, flags} = this.parse(Hello);

    cli.action.start('Starting');

    const results = await start();

    cli.action.stop('complete!');

    results.forEach(p => {
      const isRunning = p.state === AgentContainerState.Running;
      const {usage, percentage} = p.memory;

      this.log(`${isRunning ? '🟢' : '🔴'} ${p.name}\t${p.state}${usage && `\t${usage} (${percentage})`}`);
    });
  }
}
