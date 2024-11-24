const fs = require('fs');
const path = require('path');
const loadJsonFile = require('../utils/loadJsonFile');
const { InteractionResponseType } = require('discord-interactions');

let servicesCache = null;
let servicesLastModified = null;
const servicesFilePath = path.join(__dirname, '../data/services.json');

function loadServices() {
    const stats = fs.statSync(servicesFilePath);
    if (!servicesLastModified || stats.mtime > servicesLastModified) {
        servicesLastModified = stats.mtime;
        servicesCache = loadJsonFile('data/services.json');
    }
    return servicesCache;
}

function handleAutocomplete(interaction) {
    switch (interaction.data.name) {
        case 'service':
            const services = loadServices();
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
