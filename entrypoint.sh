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

# Switch to node user and run the main container command
exec su-exec node "$@"
