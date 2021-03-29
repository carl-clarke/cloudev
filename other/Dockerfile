FROM docker:dind as base

ENV SSH_PUBKEYS=

# -----------------------------------------------------------------------------
# Install basic apps and services.
# -----------------------------------------------------------------------------
# Add 'shadow' package for usermod functionality
RUN apk add docker-compose \
    git \
    openssh-server \
    bash \
    nodejs \
    nano \
    curl \
    wget \
    shadow \
    sudo \
    monit

# -----------------------------------------------------------------------------
# Create DEV user
# -----------------------------------------------------------------------------
RUN useradd -m -G wheel -s /bin/bash dev;

# Force password change on first login
RUN echo 'dev:dev' | chpasswd; \
  passwd dev --expire;

# Add DEV to Sudoers
RUN sed -ri 's/^#?\s%wheel   ALL=(ALL) ALL\s+.*/%wheel   ALL=(ALL) ALL/' /etc/sudoers; \
    echo "dev ALL=(ALL) ALL" >> /etc/sudoers;

# Add DEV to docker group
RUN groupadd docker; \
    usermod -aG docker dev; \
    newgrp dev;

# Switch to DEV user to create correctly permissioned directories & files.
USER dev
WORKDIR /home/dev

RUN mkdir .ssh; \
    chmod 700 .ssh; \
    touch .ssh/authorized_keys; \
    chmod 600 .ssh/authorized_keys

# Done with DEV; switch back to ROOT
USER root

# -----------------------------------------------------------------------------
# Configure SSHD
# -----------------------------------------------------------------------------

# Create Host Keys
RUN mkdir /var/run/sshd; \
 ssh-keygen -A;

# Update SSHD Options
RUN sed -ri 's/^#?PubkeyAuthentication\s+.*/PubkeyAuthentication yes/' /etc/ssh/sshd_config; \
  sed -ri 's/^#?PermitRootLogin\s+.*/PermitRootLogin without-password/' /etc/ssh/sshd_config; \
  sed -ri 's/^#?PasswordAuthentication\s+.*/PasswordAuthentication no/' /etc/ssh/sshd_config; \
  sed -ri 's/^#?ClientAliveInterval\s+.*/ClientAliveInterval 10/' /etc/ssh/sshd_config; \
  sed -ri 's/^#?ClientAliveCountMax\s+.*/ClientAliveCountMax 3/' /etc/ssh/sshd_config

# -----------------------------------------------------------------------------
# Configure SSHD Monitoring
# -----------------------------------------------------------------------------

# Monit will restart sshd if port 22 becomes unresponsive.
RUN echo "check process sshd with pidfile /var/run/sshd.pid" >> /etc/monitrc; \
    echo "  start program \"/usr/sbin/sshd\"" >> /etc/monitrc; \
    echo "  stop program \"/bin/sh -c 'kill -s SIGTERM \`cat /var/run/sshd.pid\`'\"" >> /etc/monitrc; \
    echo "  if failed port 22 protocol ssh then restart" >> /etc/monitrc; \
    echo "  if 5 restarts within 5 cycles then timeout" >> /etc/monitrc;

# -----------------------------------------------------------------------------
# Start
# -----------------------------------------------------------------------------
ENTRYPOINT (\
  # Lazy-add ssh keys only the first time container is run.
  # This means key cannot be changes after first startup!
  [ -f /dev/.ssh/authorized_keys ] || echo "$SSH_PUBKEYS" > "/home/dev/.ssh/authorized_keys") && \
  # Start sshd daemon
  "/usr/sbin/sshd" && \
  # Start sshd monitor
  "/usr/bin/monit" && \
  # Start docker-in-docker daemon
  "dockerd-entrypoint.sh"

CMD []
