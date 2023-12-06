const axios = require('axios');
const loadJsonFile = require('../utils/loadJsonFile'); // Import the utility

require('dotenv').config();

const applicationId = process.env.APPLICATION_ID; // Replace with your application's ID
const token = process.env.DISCORD_TOKEN; // Your bot token or client credentials token

const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
const headers = { Authorization: `Bot ${token}` };
const commandsFile = 'data/commands.json'; // Path to the commands file

async function pushCommands() {
    let fileCommands;
    try {
        fileCommands = loadJsonFile(commandsFile); // Load commands using utility
    } catch (error) {
        console.error('Error reading command file:', error);
        process.exit(1);
    }

    try {
        // Map file commands for easy lookup
        const fileCommandMap = new Map(fileCommands.map(cmd => [cmd.name, cmd]));

        // Fetch existing commands from Discord
        const existingCommands = await axios.get(url, { headers });
        const existingCommandMap = new Map(existingCommands.data.map(cmd => [cmd.name, cmd]));

        // Find commands to add or update
        for (const fileCommand of fileCommands) {
            if (!existingCommandMap.has(fileCommand.name)) {
                // Add new command
                console.log(`Adding new command: ${fileCommand.name}`);
                await axios.post(url, fileCommand, { headers });
            } else {
                const existingCommand = existingCommandMap.get(fileCommand.name);
                if (JSON.stringify(fileCommand) !== JSON.stringify(existingCommand)) {
                    // Update existing command
                    console.log(`Updating command: ${fileCommand.name}`);
                    await axios.patch(`${url}/${existingCommand.id}`, fileCommand, { headers });
                }
            }
        }

        // Find and delete commands that are not in the file
        for (const [name, existingCommand] of existingCommandMap) {
            if (!fileCommandMap.has(name)) {
                console.log(`Deleting command: ${name}`);
                await axios.delete(`${url}/${existingCommand.id}`, { headers });
            }
        }

        console.log('Commands updated successfully');
    } catch (error) {
        console.error('Error updating commands:', error);
    }
}

pushCommands();
