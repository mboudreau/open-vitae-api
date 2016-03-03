var bunyan = require('bunyan');
var config =
{
    name: 'open-vitae',
    streams: [
        {
            level: 'info',
            stream: process.stdout
        }
    ]
};

module.exports = bunyan.createLogger(config);
