import { exec } from "shelljs";

export const execAsync = async (command: string) =>
  await new Promise<string>((accept, reject) =>
  exec(
    command,
    (exitCode, data, err) => exitCode !== 0 ? reject(err) : accept(data)
    ));
