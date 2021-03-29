#!/bin/bash

usage() {
  echo "Arguments are invalid!"
}

# -----------------------------------------------------------------------------
# Read Args
# -----------------------------------------------------------------------------
while [ "$1" != "" ]; do
  case $1 in
  -n | --name)
    shift
    ARG_NAME=$1
    ;;
  # -p | --project)
  #   shift
  #   project=$1
  #   ;;
  *)
    usage
    exit 1
    ;;
  esac
  shift
done

# -----------------------------------------------------------------------------
# Validate Args
# -----------------------------------------------------------------------------
if $ARG_NAME == ""; then
  echo "--name argument is required."
fi

# -----------------------------------------------------------------------------
# Declarations
# -----------------------------------------------------------------------------
PORT_SSH_START=22000
PORT_SSH_END=22999
IMAGE=cloud-dev:latest
USER_NAME=$ARG_NAME
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

# Make user's "data" directory if it doesn't exist.
if [ ! -d "$USER_DATA_DIR" ]; then
  mkdir $USER_DATA_DIR
  chmod 700 $USER_DATA_DIR
  echo "Created $USER_NAME/$USER_DATA_DIRNAME"
fi

# Make user's "keys" directory if it doesn't exist.
if [ ! -d "$USER_KEYS_DIR" ]; then
  mkdir $USER_KEYS_DIR
  echo "Created $USER_NAME/$USER_KEYS_DIRNAME"
fi

# Generate keys
if ! test -f "$USER_ID_RSA"; then
  ssh-keygen -q -t rsa -b 4096 -P "" -f $USER_ID_RSA
  echo "Generated new key $USER_NAME/$USER_KEYS_DIR/$USER_ID_RSA_KEYNAME"
fi

# Must be initialized after keys are generated.
SSH_PUBKEYS=$(cat $USER_ID_RSA_PUB)

if [ ! "$(docker ps -a -q -f name=$USER_NAME)" ]; then
  docker run \
    -itd \
    --runtime=sysbox-runc \
    --restart always \
    --name $USER_NAME \
    -e SSH_PUBKEYS="$SSH_PUBKEYS" \
    -p $SSH_PORT:22 \
    -v $EFS_USERS/$USER_NAME/data:/mnt/cloud-drive \
    $IMAGE

  echo "Container running at port $SSH_PORT"
else
  echo "Container '$USER_NAME' already exists! Aborting."
fi
