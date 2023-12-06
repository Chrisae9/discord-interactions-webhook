const { InteractionType, InteractionResponseType } = require('discord-interactions');
const handleAutocomplete = require('./handleAutocomplete');
const handleApplicationCommand = require('./handleApplicationCommand');
const createEmbed = require('../utils/createEmbed');

require('dotenv').config();

const ALLOWED_GUILD_IDS = process.env.ALLOWED_GUILD_IDS ? process.env.ALLOWED_GUILD_IDS.split(',') : [];
const ALLOWED_ROLE_IDS = process.env.ALLOWED_ROLE_IDS ? process.env.ALLOWED_ROLE_IDS.split(',') : [];

function handleCommands(interaction) {
    const userId = interaction.member.user.id;
    const userName = interaction.member.user.username;
    const dateTime = new Date().toISOString();

    if (interaction.type === InteractionType.APPLICATION_COMMAND_AUTOCOMPLETE) {
        return handleAutocomplete(interaction);
    }

    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
        const commandName = interaction.data.name;
        const options = interaction.data.options || [];
        const serviceOption = options.find(opt => opt.name === 'name')?.value || 'N/A';
        const actionOption = options.find(opt => opt.name === 'action')?.value || 'N/A';

        console.log(`[${dateTime}] User ${userName} (${userId}) requested to run command '${commandName}' with service '${serviceOption}' and action '${actionOption}'`);
    }

    // Check if the interaction is from an allowed guild
    if (!ALLOWED_GUILD_IDS.includes(interaction.guild_id)) {
        console.log(`[${dateTime}] Access denied for user ${userName} (${userId}) in guild ${interaction.guild_id}. Guild not allowed.`);
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
    const memberRoles = interaction.member.roles;
    const memberHasAllowedRole = memberRoles.some(roleId => ALLOWED_ROLE_IDS.includes(roleId));
    if (!memberHasAllowedRole) {
        console.log(`[${dateTime}] Access denied for user ${userName} (${userId}) in guild ${interaction.guild_id}. Role not allowed.`);
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

    console.log(`[${dateTime}] Unknown interaction type: ${interaction.type} for user ${userName} (${userId})`);
    return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: 'Unknown interaction type',
            flags: 64 // Making the message ephemeral
        },
    };
}

module.exports = handleCommands;
