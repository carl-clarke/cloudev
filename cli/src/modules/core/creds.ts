import { promises as fs } from 'fs';
import jwtDecode from 'jwt-decode';
import { homedir } from 'os';
import path from 'path';
import { IDTOKEN_CONFIG_FILE } from './constants';

const userHomeDir = homedir();
const idTokenFile = path.join(userHomeDir, IDTOKEN_CONFIG_FILE);

export async function saveToken(idToken: string) {
  return fs.writeFile(idTokenFile, idToken);
}

export async function getToken() {
  let result;
  try {
    result = (await fs.readFile(idTokenFile)).toString();
  } catch {
    result = null;
  }

  return result;
}

export async function deleteToken() {
  try {
    return fs.unlink(idTokenFile);
  } catch { }
}

export async function getCreds() {
  let result;

  try {
    result = jwtDecode(await getToken() ?? '');
  } catch {
    result = null;
  }

  return result;
}
