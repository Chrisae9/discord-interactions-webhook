FROM node:22.2.0-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json if it exists
COPY package.json package-lock.json ./

# Change ownership of the working directory to the node user
RUN chown -R node:node /app

# Switch to the node user
USER node

# Install dependencies
RUN npm install

# Copy the rest of the application files with correct ownership
COPY --chown=node:node . .

# Set the default command
CMD ["npm", "run", "start"]
