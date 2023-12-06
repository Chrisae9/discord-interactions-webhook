const loadJsonFile = require('../utils/loadJsonFile');
const { InteractionResponseType } = require('discord-interactions');

function handleAutocomplete(interaction) {
    switch (interaction.data.name) {
        
        case 'service':
            const services = loadJsonFile('data/services.json'); // Updated file path
            const focusedOption = interaction.data.options.find(option => option.focused);

            const filteredServices = services.filter(service =>
                service.name.toLowerCase().startsWith(focusedOption.value.toLowerCase())
            ).map(service => ({ name: service.name, value: service.value }));

            return {
                type: InteractionResponseType.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT,
                data: {
                    choices: filteredServices.slice(0, 25) // Limit to 25 choices
                }
            };

        // Add more cases for other autocomplete interactions as needed
        // case 'other_command':
        //     ...

        default:
            console.log('Unknown autocomplete command:', interaction.data.name);
            return {
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: 'Unknown command for autocomplete',
                },
            };
    }
}

module.exports = handleAutocomplete;
