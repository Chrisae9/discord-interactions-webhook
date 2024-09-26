#!/bin/sh

# Get the group ID of the docker group on the host
DOCKER_GID=$(stat -c '%g' /var/run/docker.sock 2>/dev/null)

if [ -z "$DOCKER_GID" ]; then
  echo "Docker socket not found. Skipping Docker group setup."
  echo "Note: If you are trying to run the app with Docker capabilities, ensure that you mount the Docker socket using -v /var/run/docker.sock:/var/run/docker.sock."
else
  # Remove existing docker group and create a new one with the correct GID
  if getent group docker > /dev/null; then
    delgroup docker
  fi

  addgroup -g ${DOCKER_GID} docker

  # Add the node user to the docker group
  addgroup node docker
fi

# Change the ownership of the application files to the node user
chown -R node:node /app

# Setup cron job if enabled
if [ "$SHUTDOWN_ENABLED" = "true" ]; then
  # Set the timezone if provided
  if [ -n "$TZ" ]; then
    echo "Setting timezone to $TZ..."
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
  fi

  echo "Setting up cron jobs..."

  # Create the cron job file in /etc/crontabs/root
  cat <<EOF > /etc/crontabs/root
# Cron jobs

# Shutdown services at specified time
$SHUTDOWN_TIME node /usr/local/bin/shutdown-services.sh
EOF

  # Ensure the crontab file has correct ownership and permissions
  chown root:root /etc/crontabs/root
  chmod 600 /etc/crontabs/root

  # Ensure the log directory exists and is writable
  mkdir -p /var/log/cron
  touch /var/log/cron/cron.log
  chown root:root /var/log/cron/cron.log
  chmod 644 /var/log/cron/cron.log

  # Start the cron daemon with enhanced logging
  crond -b -l 8 -L /var/log/cron/cron.log

  # Tail the cron log to stdout so it appears in Docker logs
  tail -F /var/log/cron/cron.log &
fi

# Switch to node user and run the main container command
exec su-exec node "$@"
