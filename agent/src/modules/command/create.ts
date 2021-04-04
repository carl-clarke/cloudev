import { Context, execAsync, log, Lookup, sanitizeArgs } from '@/modules/core';
import { promises as fs } from 'fs';
import getPort from 'get-port';
import path from 'path';
import { chmod, mkdir } from 'shelljs';

export async function createCommand(context: Context, args: Lookup, payload: Lookup) {
  log('[Command:PS] invoked with args', args);
  const { username, config } = context;
  const safeArgs = sanitizeArgs(args);
  const {
    IMAGE,
    HOST_USERS_DIR_PATH,
    USER_DATA_DIR_NAME,
    USER_KEYS_DIR_NAME,
    USER_KEY_NAME,
    HOST_SSH_PORT_START,
    HOST_SSH_PORT_END,
    CONTAINER_SSHD_PORT,
    CONTAINER_USER_DATA_MOUNT_PATH,
    CONTAINER_CLOUD_DRIVE_MOUNT_PATH
  } = config;

  const userDir = path.join(HOST_USERS_DIR_PATH, username);
  const userDataDirPath = path.join(userDir, USER_DATA_DIR_NAME);
  const userKeysDirPath = path.join(userDir, USER_KEYS_DIR_NAME);
  const sshPrivateKeyPath = path.join(userKeysDirPath, USER_KEY_NAME)
  const sshPubKeyPath = `${sshPrivateKeyPath}.pub`;
  const sshBindPort = await getPort({
    port: getPort.makeRange(HOST_SSH_PORT_START, HOST_SSH_PORT_END)
  });
  const containerName = payload.name;
  const containerId = `${username}.${containerName}`;

  // Make user's "data" directory if it doesn't exist.
  if (!await fs.stat(userDataDirPath)) {
    mkdir('-p', userDataDirPath);
    chmod('', '777', userDataDirPath);
    log(`  ✔️ Created ${username}/${USER_DATA_DIR_NAME}`)
  }

  // Make user's "keys" directory if it doesn't exist.
  if (!await fs.stat(userKeysDirPath)) {
    mkdir('-p', userKeysDirPath);
    log(`  ✔️ Created ${username}/${USER_KEYS_DIR_NAME}`);
  }

  // Generate keys
  if (!fs.stat(sshPrivateKeyPath)) {
    await execAsync(`ssh - keygen - q - t rsa - b 4096 - P "" - f ${sshPrivateKeyPath}`);
    log(`  ✔️ Generated new key ${USER_KEYS_DIR_NAME}/${USER_KEY_NAME}`)
  }

  // Must be initialized after keys are generated.
  const sshPubKeyValue = (await fs.readFile(sshPubKeyPath)).toString();
  const sshPrivateKeyValue = (await fs.readFile(sshPrivateKeyPath)).toString();

  console.log({
    containerId, sshBindPort,
    userDataDirPath, userKeysDirPath, sshPrivateKeyPath, sshPubKeyPath,
    // sshPrivateKeyValue,
    // sshPubKeyValue
  })
  
  if (await execAsync(`docker volume ls -f 'name=${containerId}' --format '{{.Name}}'`) === '') {
    log('  Creating volume...')
    await execAsync(`docker volume create ${containerId} 1> /dev/null`);
    log("  ✔️ Created new volume");
  }

  if (await execAsync(`docker ps -a -q -f 'name=${containerId}' --format '{{.Names}}'`) === '') {
    log('  Creating container...');
    
    await execAsync(`\
      docker run \
        -itd \
        --runtime=sysbox-runc \
        --restart always \
        --name "${containerId}" \
        -e SSH_PUBKEYS="${sshPubKeyValue}" \
        -p ${sshBindPort}:${CONTAINER_SSHD_PORT} \
        -v "${userDataDirPath}":"${CONTAINER_CLOUD_DRIVE_MOUNT_PATH}" \
        -v ${containerId}:"${CONTAINER_USER_DATA_MOUNT_PATH}" \
        -l cloudev.user=${username} \
        -l cloudev.name=${containerName} \
        ${IMAGE} \
        1> /dev/null
    `);
    log(`  ✔️ Container started at port ${sshBindPort}`);
  }
  else {
    log("  ❌ Container already exists! Aborting to prevent data-loss.");
    throw new Error(`Container with name "${containerName}" already exists.`);
  }

  return {
    key: sshPrivateKeyValue,
    port: sshBindPort
  };
}
