FROM node:22.2.0-alpine

# Set the working directory
WORKDIR /app

# Install Docker, Docker Compose, su-exec, and jq
RUN apk add --no-cache docker docker-compose jq su-exec busybox-suid

# Copy package.json and package-lock.json if it exists
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Copy the shutdown script
COPY scripts/shutdown-services.sh /usr/local/bin/shutdown-services.sh
RUN chmod +x /usr/local/bin/shutdown-services.sh

# Change the ownership of the application files to the node user
RUN chown -R node:node /app

# Move the entry point script to /usr/local/bin/ and make it executable
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Set the entry point
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Set the default command
CMD ["npm", "run", "start"]
