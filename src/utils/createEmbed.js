function actionColor(action) {
    switch (action) {
        case 'start':
            return 0x28a745; // Green
        case 'stop':
            return 0xdc3545; // Red
        case 'status':
            return 0x007bff; // Blue
        case 'denied':
            return 0xFFA500; // Orange
        default:
            return 0x6c757d; // Gray
    }
}

function formatOutput(output) {
    return output.length > 1024 ? output.substring(0, 1021) + '...' : output;
}

function createEmbed({ title, description, action, output = '', footerText = "Discord Interaction" }) {
    const fields = output ? [{
        name: `Output for ${action.toUpperCase()}`,
        value: formatOutput(output)
    }] : [];

    return {
        title: title,
        description: description,
        color: actionColor(action),
        fields: fields,
        footer: {
            text: footerText
        },
        timestamp: new Date().toISOString()
    };
}

module.exports = createEmbed;
