FROM node:22.2.0-alpine

# Set the working directory
WORKDIR /app

# Install Docker and Docker Compose
RUN apk add --no-cache docker docker-compose su-exec

# Copy package.json and package-lock.json if it exists
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Change the ownership of the application files to the node user
RUN chown -R node:node /app

# Move the entry point script to /usr/local/bin/ and make it executable
RUN mv entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Use root user
USER root

# Set the entry point
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Set the default command
CMD ["npm", "run", "start"]
