const fs = require('fs');

// Log trade to a file and console
const logTrade = (message, tradeHistory) => {
    const logMessage = `${new Date().toISOString()}: ${message}\n`;

    // Append log message to the file
    fs.appendFile('tradeLog.txt', logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        } else {
            console.log('Trade logged:', logMessage);
        }
    });

    tradeHistory.push(message); // Store trade in history
};

module.exports = { logTrade };