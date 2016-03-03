/* global process:true */

'use strict';

var cf = require('clusterfork'),
    server = require('./src/server'),
    logger = require('./src/logger'),
    production = process.env.PRODUCTION || false,
    port = process.env.port || 8000;

module.exports = cf(
    function () {
        server.create({port: port}).start()
    },
    production ? 0 : 1) // sets 0 workers for production, which uses max cpus
    .start()
    .then(function (server) {
        logger.info('Scout API Started with %d worker%s on port %d', server.workers, server.workers == 1 ? '' : 's', port);
    });