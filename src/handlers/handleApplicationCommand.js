const runDockerCompose = require('./dockerCommandHandler');
const { InteractionResponseType } = require('discord-interactions');

function handleApplicationCommand(interaction) {
    switch (interaction.data.name) {
        case 'service':
            const userId = interaction.member.user.id;
            const userName = interaction.member.user.username;
            const commandName = interaction.data.name;
            const selectedService = interaction.data.options.find(opt => opt.name === 'name').value;
            const action = interaction.data.options.find(opt => opt.name === 'action').value;
            const dateTime = new Date().toISOString();
        
            // Log the command request details
            console.log(`[${dateTime}] User ${userName} (${userId}) requested to run command '${commandName}' with service '${selectedService}' and action '${action}'`);
        
            runDockerCompose(selectedService, action, interaction.token);
    
            // Immediately acknowledge the interaction
            return {
                type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    flags: 64 // Attempt to make the message ephemeral
                }
            };
    }
}

module.exports = handleApplicationCommand;
