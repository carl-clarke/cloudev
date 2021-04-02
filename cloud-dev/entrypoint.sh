#!/bin/bash

SSH_DIR=/home/dev/.ssh

# Create symlink to cloud-drive in user's home directory.
if [ ! -f /home/dev/cloud-drive ]; then
  ln -s /mnt/cloud-drive /home/dev/
fi

# Lazy-add ssh keys only the first time container is run.
# This means key cannot be changes after first startup!
if [ ! -f $SSH_DIR ]; then
  # mkdir $SSH_DIR
  # chown -R dev $SSH_DIR
  # chmod 700 $SSH_DIR
  echo "$SSH_PUBKEYS" > $SSH_DIR/authorized_keys 
  # chmod 600 $SSH_DIR/authorized_keys
fi

# Start sshd daemon
/usr/sbin/sshd
# Start sshd monitor
/usr/bin/monit
# Start docker-in-docker daemon
dind.sh