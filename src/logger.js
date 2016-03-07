var bunyan = require('bunyan');
var config =
{
    name: 'open-vitae',
    streams: [
        {
            level: 'debug',
            stream: process.stdout
        }
    ]
};

module.exports = bunyan.createLogger(config);
