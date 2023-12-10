# Discord Interaction Webhook

## Overview
This application leverages Discord's Interaction API to manage Docker services via Discord commands. Built with Node.js, it offers a convenient way to start and stop Docker services using Discord's slash commands with autocomplete functionality.

## Features
- **Slash Commands with Autocomplete**: Execute predefined slash commands within Discord, utilizing the autocomplete feature for enhanced user interaction.
- **Service Management**: Manage Docker services, supporting start and stop commands.
- **Role and Guild Restricted Access**: Restrict command usage to specific roles within designated Discord guilds.

## Installation & Setup
1. Clone the repository:
   ```
   git clone https://github.com/Chrisae9/discord-interactions-webhook
   ```
2. Install dependencies:
   ```
   cd discord-interactions-webhook
   npm install
   ```
3. Configure environment variables in `.env` file:
   ```
   DISCORD_PUBLIC_KEY=your_discord_public_key
   DISCORD_TOKEN=your_discord_bot_token
   APPLICATION_ID=your_discord_application_id
   ALLOWED_GUILD_ID=allowed_guild_id
   ALLOWED_ROLE_ID=allowed_role_id
   ```

## Managing Commands
- Use `npm run pull` to populate `commands.json` with current commands from Discord.
- Apply changes to commands using `npm run push`.

## Creating Commands
To define new commands, update `commands.json`. Example structure:
```json
{
  "name": "service",
  "description": "Manage Docker services",
  "options": [
    {
      "name": "name",
      "type": 3,
      "description": "Name of the service",
      "required": true,
      "autocomplete": true
    },
    {
      "name": "action",
      "type": 3,
      "description": "Action to perform on the service",
      "required": true,
      "choices": [
        { "name": "start", "value": "start" },
        { "name": "stop", "value": "stop" }
      ]
    }
  ]
}
```

## Running the Application
Start the server with:
```
npm start
```

To deploy and manage the application as a service using systemd, follow these steps:
```
systemctl link /path/to/folder/discord-webhook.service
systemctl start discord-webhook.service 
systemctl enable discord-webhook.service 
```

## License
This project is under the [MIT License](LICENSE).

## Contributing
Contributions are welcome. Please adhere to the project's coding style and include tests for new features or bug fixes.
