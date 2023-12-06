const runDockerCompose = require('./dockerCommandHandler');
const { InteractionResponseType } = require('discord-interactions');

function handleApplicationCommand(interaction) {
    switch (interaction.data.name) {
        case 'service':
            const selectedService = interaction.data.options.find(opt => opt.name === 'name').value;
            const action = interaction.data.options.find(opt => opt.name === 'action').value;
       
            runDockerCompose(selectedService, action, interaction.token);
    
            // Immediately acknowledge the interaction
            return {
                type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
            };
    }
}

module.exports = handleApplicationCommand;
