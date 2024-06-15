# Discord Interactions Webhook

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Quick Start](#quick-start)
4. [Running the Application](#running-the-application)
5. [Configuring Cron Job](#configuring-cron-job)
6. [License](#license)
7. [Contributing](#contributing)

## Overview
This application leverages Discord's Interaction API to manage Docker services via Discord commands. Built with Node.js, it offers a convenient way to dynamically manage Docker services using Discord's slash commands with autocomplete functionality.

## Features
- 🚀 **Slash Commands with Autocomplete**: Easily execute predefined commands within Discord, with autocomplete making interactions smooth and user-friendly.
- 🔄 **Dynamic Service Management**: Update your Docker services on-the-fly by changing the configuration file—no need to restart the container.
- 🔒 **Role and Guild Restricted Access**: Ensure only authorized roles within specific Discord guilds can use the commands, enhancing security and control.

## Quick Start

To quickly start the application, follow these steps:

1. **Create the Project Folder**:
   - Create a folder named `discord-interactions-webhook` to hold the `.env` file, the `docker-compose.yaml` file, and the `data` folder.

2. **Create and Configure `.env` File**:
   - Create an application in the [Discord Developer Portal](https://discord.com/developers/applications).
   - In the **General Information** tab of your application, copy the `Application ID` and `Public Key`.
   - In the **Bot** tab of your application, generate a new token by clicking "Reset Token" and copy the `Bot Token`.
   - Create a `.env` file in your `discord-interactions-webhook` folder with the following content:

     ```env
     APPLICATION_ID=your_discord_application_id
     DISCORD_PUBLIC_KEY=your_discord_public_key
     DISCORD_TOKEN=your_discord_bot_token
     PORT=5000

     ALLOWED_GUILD_IDS=allowed_guild_id
     ALLOWED_ROLE_IDS=allowed_role_id

     # Cron job configuration
     SHUTDOWN_ENABLED=false
     SHUTDOWN_TIME="0 3 * * *"
     
     # Timezone
     TZ=America/New_York
     ```

     - **Note**: You can grab Guild IDs and Role IDs by enabling developer mode in Discord settings and right-clicking on the role and server to copy their IDs. These are required for the bot to function properly and are highly recommended for security since the container has access to the Docker socket.

3. **Create Data Directory**:
   - Create a `data` directory in your `discord-interactions-webhook` folder to persist data.

4. **Manage Discord Commands**:
   - **Pull Commands**: Populate `data/commands.json` with current commands from Discord by running:
     ```sh
     docker run --env-file .env -v ./data:/app/src/data --rm chrisae9/discord-webhook-service:latest /bin/sh -c "npm run pull"
     ```
   - **Update Commands**: Modify `data/commands.json` to include the following structure:
     ```json
     [
       {
         "id": "************2392",
         "application_id": "************2232",
         "version": "************3632",
         "default_member_permissions": null,
         "type": 1,
         "name": "service",
         "description": "Manage services",
         "dm_permission": true,
         "contexts": null,
         "integration_types": [0],
         "options": [
           {
             "type": 3,
             "name": "name",
             "description": "Select a service",
             "autocomplete": true
           },
           {
             "type": 3,
             "name": "action",
             "description": "Choose an action",
             "choices": [
               {
                 "name": "start",
                 "value": "start"
               },
               {
                 "name": "stop",
                 "value": "stop"
               }
             ]
           }
         ],
         "nsfw": false
       }
     ]
     ```
     - **Note**: Ensure that the `id`, `application_id`, and `version` fields match the data pulled from your specific application.

   - **Push Commands**: Apply the updated commands by running:
     ```sh
     docker run --env-file .env -v ./data:/app/src/data --rm chrisae9/discord-webhook-service:latest /bin/sh -c "npm run push"
     ```

   - Refer to the [`service.json`](/data/services.json) in the repository's [data](/data) folder to configure services:
     ```json
     {
       "name": "Minecraft",
       "value": "minecraft",
       "path": "/path/to/minecraft",
       "composeFile": "docker-compose.yaml",
       "launchOptions": ""
     }
     ```
     - **Note**: The `path` should point to a directory containing another Docker Compose file.
     - **Important**: The `path` must be relative to the host, not the container. Ensure that the volume mounts in your Docker Compose or Docker Run commands align with these paths.

## Running the Application

### Using Docker Compose
To build and run the application using Docker Compose, use the following steps:

1. **Create a `docker-compose.yaml` File**:
   - Create a `docker-compose.yaml` file in your `discord-interactions-webhook` folder with the following content:

     ```yaml
     services:
       discord-webhook-service:
         image: chrisae9/discord-webhook-service:latest
         container_name: discord-webhook-service
         restart: unless-stopped
         ports:
           - "5000:5000"
         env_file:
           - .env
         volumes:
           - ./data:/app/src/data
           - /var/run/docker.sock:/var/run/docker.sock
           - ./services:/services
     ```

2. **Start the Application**:
   - Use the following command to start the application:
     ```sh
     docker-compose up -d
     ```

   - **About the `./services` Directory**:
     - The `./services` directory will be mounted to `/services` in the container. This directory is used to specify paths or directories to services' Docker Compose files in the `service.json` configuration. You can add your own mounts to this directory.
     - It is recommended to copy the structure from the repository's [`services/example/docker-compose.yaml`](./services/example/docker-compose.yaml) to first test your services. Here is an example of how your `services.json` might look:
       ```json
       {
         "name": "Example Service",
         "value": "example-service",
         "path": "/services/example",
         "composeFile": "docker-compose.yaml",
         "launchOptions": ""
       }
       ```

### Using Docker Run
If you prefer not to use Docker Compose, you can run the application directly using `docker run` with the following command:

1. **Run the Docker Container**:
   - Use the following command to start the application:
     ```sh
     docker run --env-file .env -v ./services:/services -v ./data:/app/src/data -v /var/run/docker.sock:/var/run/docker.sock -p 5000:5000 --name discord-webhook-service chrisae9/discord-webhook-service:latest
     ```

## Configuring Cron Job

The application includes a cron job feature to automatically shut down services at a specified time. This can be enabled and configured via the `.env` file.

### Configuration

1. **Enable Cron Job**:
   - Set `SHUTDOWN_ENABLED` to `true` in your `.env` file.
     ```env
     SHUTDOWN_ENABLED=true
     ```

2. **Set Shutdown Time**:
   - Configure the `SHUTDOWN_TIME` variable in the `.env` file to specify when the services should be shut down. The time format is a standard cron format.
     ```env
     SHUTDOWN_TIME="0 3 * * *"  # Default: every day at 3 AM
     ```

3. **Set Timezone**:
   - Configure the `TZ` variable in the `.env` file to set the timezone for the cron job.
     ```env
     TZ=America/New_York  # Default: America/New_York
     ```

### Cron Job Script

The cron job script is located at `/usr/local/bin/shutdown-services.sh` inside the container. It reads the `services.json` file and runs `docker-compose down` for each configured service.

### Note

- The cron job feature is only activated if `SHUTDOWN_ENABLED` is set to `true` in the `.env` file.
- Ensure the `TZ` environment variable is correctly set to match your desired timezone.

## Configure Interaction Endpoint URL
- After running the container, configure an interaction endpoint URL in the Discord Developer Portal to point to your IP/domain, e.g., `https://yourdomain.com/interactions`.

- This assumes that you have a reverse proxy set up to route Discord requests to the application.

## License
This project is under the [MIT License](LICENSE).

## Contributing
Contributions are welcome. Please adhere to the project's coding style and include tests for new features or bug fixes. For detailed setup instructions, see the [CONTRIBUTING](CONTRIBUTING.md) document.
