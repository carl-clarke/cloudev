import { exec } from 'shelljs';

export const execAsync = async (command: string) =>
  new Promise<string>((accept, reject) =>
    exec(
      command,
      // eslint-disable-next-line no-negated-condition
      (exitCode, data, err) => exitCode !== 0 ? reject(err) : accept(data)
    ));
