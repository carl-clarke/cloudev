import { promises as fs } from 'fs';
import { homedir } from 'os';
import path from 'path';
import shelljs from 'shelljs';
import { getHost } from '../core';
import { SSH_CONFIG_HOST_SUFFIX } from './constants';
const sshConfig = require('ssh-config');
const userHomeDir = homedir();
const sshDir = path.join(userHomeDir, '.ssh');
const keysDir = path.join(sshDir, SSH_CONFIG_HOST_SUFFIX);
const configFile = path.join(sshDir, 'config');

export async function sshAddConfig(name: any, key: string, port: number) {
  const configFileRaw = (await fs.readFile(configFile)).toString();
  const config = sshConfig.parse(configFileRaw);
  const newHostName = `${name}.${SSH_CONFIG_HOST_SUFFIX}`;
  const host = await getHost();
  const keyFile = path.join(keysDir, name);

  try {
    await fs.access(keysDir);
  } catch {
    await fs.mkdir(keysDir, { recursive: true });
  }

  await fs.writeFile(keyFile, key);
  await shelljs.chmod(600, keyFile);

  // Remove existing host with this name if it exists.
  config.remove({ Host: newHostName });

  const sshConfigContent = sshConfig.stringify(config) + `
Host "${newHostName}"
HostName ${host.ip}
Port ${port}
IdentityFile ${keyFile}
User dev`;

  await fs.writeFile(`${configFile}.bak`, configFileRaw);
  await fs.writeFile(configFile, sshConfigContent);

  return {
    host: newHostName,
  };
}

export async function sshRemoveConfig(name: any) {
  const configFileRaw = (await fs.readFile(configFile)).toString();
  const config = sshConfig.parse(configFileRaw);
  const existingHostName = `${name}.${SSH_CONFIG_HOST_SUFFIX}`;
  const keyFile = path.join(keysDir, name);

  try {
    await fs.chmod(keyFile, 777);
    await fs.unlink(keyFile);
  } catch { }

  // Remove existing host with this name if it exists.
  config.remove({ Host: existingHostName });

  const sshConfigContent = sshConfig.stringify(config);

  await fs.writeFile(`${configFile}.bak`, configFileRaw);
  await fs.writeFile(configFile, sshConfigContent);
}
