#!/bin/bash

usage() {
  echo "Usage:"
  echo -e "-u | --user\t User identifier, eg. cclarke"
  echo -e "-n | --name\t Container name, eg. main"
}

# -----------------------------------------------------------------------------
# Read Args
# -----------------------------------------------------------------------------
while [ "$1" != "" ]; do
  case $1 in
  -u | --user)
    shift
    ARG_USER=$1
    ;;
  -n | --name)
    shift
    ARG_NAME=$1
    ;;
  *)
    echo "Invalid argument $1"
    usage
    exit 1
    ;;
  esac
  shift
done

# -----------------------------------------------------------------------------
# Validate Args
# -----------------------------------------------------------------------------
if [ ! "$ARG_USER" ]; then
  echo "A username must be provided with the --user flag."
  exit 1
elif [ ! "$ARG_NAME" ]; then
  echo "A unique container name must be provided with the --name flag."
  exit 1
fi

# -----------------------------------------------------------------------------
# Declarations
# -----------------------------------------------------------------------------
PORT_SSH_START=22000
PORT_SSH_END=22999
IMAGE=cloud-dev:latest
USER_NAME=$ARG_USER
CONTAINER_ID=$ARG_NAME
CONTAINER_NAME=$USER_NAME.$CONTAINER_ID
EFS_USERS=/mnt/efs/fs1/users
USER_KEYS_DIRNAME=keys
USER_DATA_DIRNAME=data
USER_ID_RSA_KEYNAME=id_rsa

# -----------------------------------------------------------------------------
# Functions
# -----------------------------------------------------------------------------
find_port() {
  local port=$PORT_SSH_START;
  local port_max=$PORT_SSH_END;

  while [[ $port -lt $port_max ]]
  do
    if  sudo lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
      port=$((port+1))
    else
      break
    fi
  done
  
  echo $port
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
USER_DIR=$EFS_USERS/$USER_NAME
USER_DATA_DIR=$USER_DIR/$USER_DATA_DIRNAME
USER_KEYS_DIR=$USER_DIR/$USER_KEYS_DIRNAME
USER_ID_RSA=$USER_KEYS_DIR/$USER_ID_RSA_KEYNAME
USER_ID_RSA_PUB=$USER_ID_RSA.pub
SSH_PORT=$(find_port)

echo "Configuring DEV environment '$CONTAINER_NAME'"

# Make user's "data" directory if it doesn't exist.
if [ ! -d "$USER_DATA_DIR" ]; then
  mkdir -p $USER_DATA_DIR
  chmod 777 $USER_DATA_DIR
  echo -e "  ✔️ Created $USER_NAME/$USER_DATA_DIRNAME"
fi

# Make user's "keys" directory if it doesn't exist.
if [ ! -d "$USER_KEYS_DIR" ]; then
  mkdir -p $USER_KEYS_DIR
  echo -e "  ✔️ Created $USER_NAME/$USER_KEYS_DIRNAME"
fi

# Generate keys
if ! test -f "$USER_ID_RSA"; then
  ssh-keygen -q -t rsa -b 4096 -P "" -f $USER_ID_RSA
  echo -e "  ✔️ Generated new key $USER_KEYS_DIR/$USER_ID_RSA_KEYNAME"
fi

# Must be initialized after keys are generated.
SSH_PUBKEYS=$(cat $USER_ID_RSA_PUB)

if [ ! "$(docker volume ls -f name=$CONTAINER_NAME)" ]; then
  docker volume create $CONTAINER_NAME 1> /dev/null
  echo -e "  ✔️ Created new volume"
fi

if [ ! "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
  docker run \
    -itd \
    --runtime=sysbox-runc \
    --restart always \
    --name $CONTAINER_NAME \
    -e SSH_PUBKEYS="$SSH_PUBKEYS" \
    -p $SSH_PORT:22 \
    -v $EFS_USERS/$USER_NAME/data:/mnt/cloud-drive \
    -v $CONTAINER_NAME:/home/dev \
    -l cloudev.user=$USER_NAME \
    -l cloudev.name=$CONTAINER_ID \
    $IMAGE \
    1> /dev/null

  echo -e "  ✔️ Container started at port $SSH_PORT"
else
  echo -e "  ❌ Container already exists! Aborting to prevent data-loss."
fi
