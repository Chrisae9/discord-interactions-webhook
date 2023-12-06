const { exec } = require('child_process');
const loadJsonFile = require('../utils/loadJsonFile');
const sendFollowUpMessage = require('./sendFollowUpMessage');

function runDockerCompose(serviceValue, action, interactionToken) {
    const services = loadJsonFile('data/services.json');
    const service = services.find(s => s.value === serviceValue);

    if (!service) {
        console.error(`Service not found: ${serviceValue}`);
        sendFollowUpMessage(interactionToken, `Error: Service not found`, `Service not found: ${serviceValue}`, '', 'error');
        return;
    }

    let command;
    switch (action) {
        case 'start':
            command = `docker-compose -f ${service.composeFile} up -d ${service.launchOptions || ''}`;
            break;
        case 'stop':
            command = `docker-compose -f ${service.composeFile} down`;
            break;
        default:
            console.error(`Unknown action: ${action}`);
            sendFollowUpMessage(interactionToken, `Unknown action`, `Unknown action: ${action}`, '', 'error');
            return;
    }

    exec(command, { cwd: service.path }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Docker Compose: ${error.message}`);
            sendFollowUpMessage(interactionToken, `Error Executing Docker Compose`, `\`\`\`${error.message}\`\`\``, '', 'error');
            return;
        }

        const combinedOutput = stdout.trim() + '\n' + stderr.trim();
        const title = `Request: ${service.name}`;
        let formattedOutput = combinedOutput ? `\`\`\`${combinedOutput}\`\`\`` : 'No additional output.';
        
        // Splice the formatted output
        if (formattedOutput.length > 1024) {
            const halfLength = 1024 / 2;
            formattedOutput = formattedOutput.slice(0, halfLength) + '...\n...' + formattedOutput.slice(-halfLength);
            formattedOutput += '```'; // Close the code block
        }

        const description = `Executing \`${action}\` action for **${service.name}**.\n\nHere's the output:\n\n${formattedOutput}`;
        sendFollowUpMessage(interactionToken, title, description, '', action);
    });
}

module.exports = runDockerCompose;
