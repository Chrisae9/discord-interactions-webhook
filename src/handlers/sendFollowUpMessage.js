const axios = require('axios');
const createEmbed = require('../utils/createEmbed'); // Import the utility function

function sendFollowUpMessage(interactionToken, title, description, output = '', action = '') {
    const url = `https://discord.com/api/v10/webhooks/${process.env.APPLICATION_ID}/${interactionToken}/messages/@original`;

    const embed = createEmbed({
        title: title,
        description: description,
        action: action,
        output: output,
        footerText: "Docker Command Execution"
    });

    axios.patch(url, { embeds: [embed] }, {
        headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
    })
    .then(response => console.log("Follow-up message sent successfully."))
    .catch(error => console.error("Error sending follow-up message:", error));
}

module.exports = sendFollowUpMessage;
