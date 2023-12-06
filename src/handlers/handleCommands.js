const { InteractionType, InteractionResponseType } = require('discord-interactions');
const handleAutocomplete = require('./handleAutocomplete');
const handleApplicationCommand = require('./handleApplicationCommand');
const createEmbed = require('../utils/createEmbed');

require('dotenv').config();

const ALLOWED_GUILD_IDS = process.env.ALLOWED_GUILD_IDS ? process.env.ALLOWED_GUILD_IDS.split(',') : [];
const ALLOWED_ROLE_IDS = process.env.ALLOWED_ROLE_IDS ? process.env.ALLOWED_ROLE_IDS.split(',') : [];

console.log('Guild IDs:', process.env.ALLOWED_GUILD_IDS);
console.log('Role IDs:', process.env.ALLOWED_ROLE_IDS);

function handleCommands(interaction) {
    console.log('Handling Command:', interaction.data.name);

    if (interaction.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
        return handleAutocomplete(interaction);
    }

    // Check if the interaction is from an allowed guild
    if (!ALLOWED_GUILD_IDS.includes(interaction.guild_id)) {
        const embed = createEmbed({
            title: "Access Restricted",
            description: "This command can't be used in this guild.",
            action: 'denied'
        });
        return { 
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, 
            data: { 
                embeds: [embed], 
                flags: 64 // Making the message ephemeral
            } 
        };
    }

    // Check if the member has any of the allowed roles
    const memberHasAllowedRole = interaction.member.roles.some(role => ALLOWED_ROLE_IDS.includes(role));
    if (!memberHasAllowedRole) {
        const embed = createEmbed({
            title: "Permission Denied",
            description: "You don't have permission to use this command.",
            action: 'denied'
        });
        return { 
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE, 
            data: { 
                embeds: [embed], 
                flags: 64 // Making the message ephemeral
            } 
        };
    }

    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        return handleApplicationCommand(interaction);
    }

    console.log('Unknown interaction type:', interaction.type);
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: 'Unknown interaction type',
            flags: 64 // Making the message ephemeral
        },
    };
}

module.exports = handleCommands;
