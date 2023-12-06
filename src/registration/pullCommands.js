const axios = require('axios');
const saveJsonFile = require('../utils/saveJsonFile'); // Import the new utility

require('dotenv').config();

const applicationId = process.env.APPLICATION_ID;
const token = process.env.DISCORD_TOKEN;
const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
const headers = { Authorization: `Bot ${token}` };
const commandsFile = 'data/commands.json'; // Updated to relative path

async function pullCommands() {
    try {
        const response = await axios.get(url, { headers });
        saveJsonFile(commandsFile, response.data); // Using saveJsonFile utility
        console.log('Existing commands written to file:', response.data);
    } catch (error) {
        console.error('Error fetching commands:', error);
    }
}

pullCommands();
