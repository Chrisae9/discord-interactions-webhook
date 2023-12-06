// utils/loadJsonFile.js

const fs = require('fs');
const path = require('path');

function loadJsonFile(filePath) {
    const absolutePath = path.join(__dirname, '..', filePath);
    const fileData = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(fileData);
}

module.exports = loadJsonFile;
