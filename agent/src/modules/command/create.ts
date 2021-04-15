import { ContainerMetadata, Context, execAsync, log, Lookup, serializeArgs, validateArgs } from '@/modules/core';
import { promises as fs } from 'fs';
import getPort from 'get-port';
import path from 'path';
import { chmod, mkdir } from 'shelljs';

const SUPPORTED_ARGS = {
};

export async function createCommand(context: Context, args: Lookup, payload: Lookup) {
  log('[Command:create] invoked with args', args);

  // Validate before going any further.
  validateArgs(args, SUPPORTED_ARGS);

  const { handle, config } = context;
  const serialArgs = serializeArgs(args);
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
    CONTAINER_CLOUD_DRIVE_MOUNT_PATH,
    CONTAINER_MEMORY_UPPER_MB,
    CONTAINER_MEMORY_LOWER_MB
  } = config;

  const userDir = path.join(HOST_USERS_DIR_PATH, handle);
  const userDataDirPath = path.join(userDir, USER_DATA_DIR_NAME);
  const userKeysDirPath = path.join(userDir, USER_KEYS_DIR_NAME);
  const sshPrivateKeyPath = path.join(userKeysDirPath, USER_KEY_NAME)
  const sshPubKeyPath = `${sshPrivateKeyPath}.pub`;
  const sshBindPort = await getPort({
    port: getPort.makeRange(HOST_SSH_PORT_START, HOST_SSH_PORT_END)
  });
  const containerName = payload.name;
  const containerId = `${handle}.${containerName}`;

  // Make user's "data" directory if it doesn't exist.
  if (!await fs.stat(userDataDirPath).catch(p => false)) {
    log(mkdir('-p', userDataDirPath));
    log(chmod('-R', '777', userDataDirPath));
    log(`✔️ Created ${handle}/${USER_DATA_DIR_NAME} directory.`)
  }

  // Make user's "keys" directory if it doesn't exist.
  if (!await fs.stat(userKeysDirPath).catch(p => false)) {
    log(mkdir('-p', userKeysDirPath));
    log(`✔️ Created ${handle}/${USER_KEYS_DIR_NAME} directory.`);
  }

  // Generate keys
  if (!await fs.stat(sshPrivateKeyPath).catch(p => false)) {
    log(`Generating SSH key-pairs`);
    await execAsync(`ssh-keygen -q -t rsa -b 4096 -P "" -f ${sshPrivateKeyPath}`);
    log(`✔️ Generated new key ${USER_KEYS_DIR_NAME}/${USER_KEY_NAME}`)
  }

  // Must be initialized after keys are generated.
  const sshPubKeyValue = (await fs.readFile(sshPubKeyPath)).toString();
  const sshPrivateKeyValue = (await fs.readFile(sshPrivateKeyPath)).toString();

  if (await execAsync(`docker volume ls -f 'name=${containerId}' --format '{{.Name}}'`) === '') {
    log('Creating volume...')
    await execAsync(`docker volume create ${containerId} 1> /dev/null`);
    log("✔️ Created new volume");
  }

  if (await execAsync(`docker ps -a -q -f 'name=${containerId}' --format '{{.Names}}'`) === '') {
    log('  Creating container...');
    
    const dockerCmd = `\
    docker run \
      -itd \
      --runtime=sysbox-runc \
      --restart always \
      --name "${containerId}" \
      --memory ${CONTAINER_MEMORY_UPPER_MB}m \
      --memory-reservation ${CONTAINER_MEMORY_LOWER_MB}m \
      -e SSH_PUBKEYS="${sshPubKeyValue}" \
      -p ${sshBindPort}:${CONTAINER_SSHD_PORT} \
      -v "${userDataDirPath}":"${CONTAINER_CLOUD_DRIVE_MOUNT_PATH}" \
      -v ${containerId}:"${CONTAINER_USER_DATA_MOUNT_PATH}" \
      -l ${ContainerMetadata.User}=${handle} \
      -l ${ContainerMetadata.Name}=${containerName} \
      -l ${ContainerMetadata.Port}=${sshBindPort} \
      ${IMAGE}
  `;

    const dockerOutput = await execAsync(dockerCmd);
    
    log(dockerOutput);
    log(`✔️ Container started at port ${sshBindPort}`);
  }
  else {
    log("❌ Container already exists! Aborting to prevent data-loss.");
    throw new Error(`Container with name "${containerName}" already exists.`);
  }

  return {
    key: sshPrivateKeyValue,
    port: sshBindPort
  };
}
