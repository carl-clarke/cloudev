export type Context = {
  username: string;
  config: Config;
};

export type Config = {
  "HOST_SSH_PORT_START": number,
  "HOST_SSH_PORT_END": number,
  "IMAGE": string,
  "HOST_USERS_DIR_PATH": string,
  "USER_KEYS_DIR_NAME": string,
  "USER_DATA_DIR_NAME": string,
  "USER_KEY_NAME": string,
  CONTAINER_SSHD_PORT: string,
  CONTAINER_USER_DATA_MOUNT_PATH: string,
  CONTAINER_CLOUD_DRIVE_MOUNT_PATH: string,
};
