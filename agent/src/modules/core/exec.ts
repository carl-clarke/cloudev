import { exec } from "shelljs";
import { log } from "./log";

export const execAsync = async (command: string) =>
  await new Promise<string>((accept, reject) =>
  exec(
    (log(command), command),
    (exitCode, data, err) => exitCode !== 0 ? reject(err) : accept(data)
  ));