// utils/saveJsonFile.js

const fs = require('fs');
const path = require('path');

function saveJsonFile(filePath, data) {
    const absolutePath = path.join(__dirname, '..', filePath);
    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2));
}

module.exports = saveJsonFile;
