const { exec } = require('child_process');
const loadJsonFile = require('../utils/loadJsonFile');
const sendFollowUpMessage = require('./sendFollowUpMessage');
const createEmbed = require('../utils/createEmbed');

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
        case 'restart':
            command = `docker-compose -f ${service.composeFile} down && docker-compose -f ${service.composeFile} up -d ${service.launchOptions || ''}`;
            break;
        case 'details':
            handleServiceDetails(service, interactionToken);
            return; // Return early as no command execution is needed
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

// Function to handle the display of service details
function handleServiceDetails(service, interactionToken) {
    // Check if details exist for the service
    if (!service.details) {
        sendFollowUpMessage(
            interactionToken, 
            `Details: ${service.name}`, 
            `No details available for **${service.name}**. The service administrator has not provided any connection information.`, 
            '', 
            'status'
        );
        return;
    }

    // Prepare the details message
    const details = service.details;
    
    let description = `## Service Information for **${service.name}**\n\n`;
    
    // Add description if available
    if (details.description) {
        description += `**Description:** ${details.description}\n\n`;
    }
    
    // Add connection information if available
    if (details.connectionInfo) {
        description += `**Connection Information:** ${details.connectionInfo}\n\n`;
    }
    
    // Add port information if available
    if (details.port && details.port !== 'N/A') {
        description += `**Port:** ${details.port}\n\n`;
    }
    
    // Add credentials if available and not N/A
    if (details.credentials) {
        const creds = details.credentials;
        if (creds.username !== 'N/A' || creds.password !== 'N/A') {
            description += `**Credentials:**\n`;
            
            if (creds.username !== 'N/A') {
                description += `- Username: \`${creds.username}\`\n`;
            }
            
            if (creds.password !== 'N/A') {
                description += `- Password: \`${creds.password}\`\n`;
            }
            
            description += `\n`;
        }
    }
    
    // Add notes if available
    if (details.notes) {
        description += `**Notes:** ${details.notes}\n\n`;
    }
    
    // Add service location details
    description += `**Service Location:** \`${service.path}\`\n`;
    description += `**Compose File:** \`${service.composeFile}\`\n`;
    
    if (service.launchOptions) {
        description += `**Launch Options:** \`${service.launchOptions}\`\n`;
    }

    // Send the details message
    sendFollowUpMessage(interactionToken, `Details: ${service.name}`, description, '', 'details');
}

module.exports = runDockerCompose;
