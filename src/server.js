const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');
const handleCommands = require('./handlers/handleCommands');

require('dotenv').config();

const app = express();
const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

// Port for the Express server
const PORT = process.env.PORT || 3000;

// Middleware for logging each incoming request
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.path}`);
    next();
});

// Middleware for verifying Discord interaction requests
app.post('/interactions',
    express.raw({ type: 'application/json' }), // Parse request body as raw JSON
    verifyKeyMiddleware(DISCORD_PUBLIC_KEY), // Verify request is from Discord
    (req, res) => {
        const interaction = req.body; // req.body is already a JavaScript object
        const response = handleCommands(interaction); // Delegate to command handler
        res.send(response);
    }
);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
