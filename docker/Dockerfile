FROM ubuntu:20.04

ENV SSH_PUBKEYS= \
  DOCKER_CHANNEL=stable \
	DOCKER_VERSION=19.03.11 \
	DOCKER_COMPOSE_VERSION=1.26.0 \
	DEBUG=false

# -----------------------------------------------------------------------------
# 1: Begin Docker in Docker Setup
# Based off https://github.com/cruizba/ubuntu-dind
# -----------------------------------------------------------------------------
RUN apt update \
    && apt install -y ca-certificates openssh-client \
    wget curl iptables supervisor \
    && rm -rf /var/lib/apt/list/*


# Docker installation
RUN set -eux; \
	\
	arch="$(uname --m)"; \
	case "$arch" in \
        # amd64
		x86_64) dockerArch='x86_64' ;; \
        # arm32v6
		armhf) dockerArch='armel' ;; \
        # arm32v7
		armv7) dockerArch='armhf' ;; \
        # arm64v8
		aarch64) dockerArch='aarch64' ;; \
		*) echo >&2 "error: unsupported architecture ($arch)"; exit 1 ;;\
	esac; \
	\
	if ! wget -O docker.tgz "https://download.docker.com/linux/static/${DOCKER_CHANNEL}/${dockerArch}/docker-${DOCKER_VERSION}.tgz"; then \
		echo >&2 "error: failed to download 'docker-${DOCKER_VERSION}' from '${DOCKER_CHANNEL}' for '${dockerArch}'"; \
		exit 1; \
	fi; \
	\
	tar --extract \
		--file docker.tgz \
		--strip-components 1 \
		--directory /usr/local/bin/ \
	; \
	rm docker.tgz; \
	\
	dockerd --version; \
	docker --version

COPY modprobe entrypoint.sh /usr/local/bin/
COPY supervisor/ /etc/supervisor/conf.d/
COPY logger.sh /opt/bash-utils/logger.sh
COPY dind.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/modprobe /usr/local/bin/dind.sh
VOLUME /var/lib/docker

# Docker compose installation
RUN curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
	&& chmod +x /usr/local/bin/docker-compose

# -----------------------------------------------------------------------------
# 1: End DIND Setup
# -----------------------------------------------------------------------------
# 2: Install basic apps and services.
# -----------------------------------------------------------------------------
RUN DEBIAN_FRONTEND="noninteractive" apt-get -y install tzdata
RUN apt update && apt-get -y install \
    # docker-compose # installed above\
    git \
    openssh-server \
    bash \
    nano \
    curl \
    wget \
    sudo \
    monit

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash ; \
    sudo apt-get install nodejs

RUN rm -rf /var/lib/apt/list/*

# -----------------------------------------------------------------------------
# 2: Create DEV user
# -----------------------------------------------------------------------------
RUN useradd -m -G sudo -s /bin/bash dev;

# Force password change on first login
RUN echo 'dev:dev' | chpasswd; \
  passwd dev --expire;

# Add DEV to Sudoers
RUN sed -ri 's/^#?\s%sudo   ALL=(ALL) ALL\s+.*/%sudo   ALL=(ALL) ALL/' /etc/sudoers; \
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

RUN touch .hushlogin

# Done with DEV; switch back to ROOT
USER root

# -----------------------------------------------------------------------------
# 2.1: Configure SSHD
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
# 2.2: Configure SSHD Monitoring
# -----------------------------------------------------------------------------

# Monit will restart sshd if port 22 becomes unresponsive.
RUN echo "check process sshd with pidfile /var/run/sshd.pid" >> /etc/monit/monitrc; \
    echo "  start program \"/usr/sbin/sshd\"" >> /etc/monit/monitrc; \
    echo "  stop program \"/bin/sh -c 'kill -s SIGTERM \`cat /var/run/sshd.pid\`'\"" >> /etc/monit/monitrc; \
    echo "  if failed port 22 protocol ssh then restart" >> /etc/monit/monitrc; \
    echo "  if 5 restarts within 5 cycles then timeout" >> /etc/monit/monitrc;

# -----------------------------------------------------------------------------
# 2.3: Configure SSHD Monitoring
# -----------------------------------------------------------------------------
RUN mkdir -p /mnt/cloud-drive
RUN chown -R dev:dev /mnt/cloud-drive
VOLUME /mnt/cloud-drive

# -----------------------------------------------------------------------------
# 2.4: Unminimize installation for full features.
# -----------------------------------------------------------------------------
RUN yes | unminimize

# -----------------------------------------------------------------------------
# 2: End services setup
# -----------------------------------------------------------------------------
# 3: Start
# -----------------------------------------------------------------------------
ENTRYPOINT "entrypoint.sh"
CMD ["sh"]
