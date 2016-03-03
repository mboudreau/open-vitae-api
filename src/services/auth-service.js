/* global process:true, __dirname:true */
/*jslint node: true */

'use strict';

var q = require('q'),
    urljoin = require('url-join'),
    jwks = require('express-jwks'),
    request = require('request'),
    logger = require('../logger'),
    configuration = {},
    locksmithUrl = process.env.LOCKSMITH_URL || 'https://locksmith-api.dc0.pageuppeople.com',
    locksmithConfigPath = process.env.LOCKSMITH_CONFIGURATION || 'identity/.well-known/openid-configuration',
    auth;


function getLocksmithConfigUrl() {
    return q(urljoin(locksmithUrl, locksmithConfigPath));
}

function getLocksmithConfiguration(configUrl) {
    var deferred = q.defer();
    request(configUrl, function (error, response, body) {
        if (error || response.statusCode != 200) {
            var err = new Error('Cannot access Locksmith Configuration URL ' + configUrl + ', Exiting.');
            logger.error(err);
            deferred.reject(err);
            return;
        }
        configuration = JSON.parse(body);
        logger.info({locksmithConfiguration: configuration}, 'Locksmith Configuration Received');
        deferred.resolve(configuration);
    });

    return deferred.promise;
}

function getLocksmithPublicKeys(config) {
    var deferred = q.defer();
    request(config.jwks_uri, function (error, response, body) {
        if (error || response.statusCode != 200) {
            var err = new Error('Cannot get Locksmith JWKs from ' + config.jwks_uri + ', Exiting.');
            logger.error(err);
            deferred.reject(err);
            return;
        }
        var keys = JSON.parse(body);
        logger.info({keys: keys}, 'Locksmith Keys Received');
        deferred.resolve(keys);
    });
    return deferred.promise;
}

function setupAuthentication(keys) {
    auth = jwks({
        secret: keys,
        issuer: configuration.issuer
    });
    return q(auth);
}

function setLocksmithInvalidationInterval() {
    var interval = setInterval(function () {
        getLocksmithConfigUrl()
            .then(getLocksmithConfiguration)
            .then(getLocksmithPublicKeys)
            .then(setupAuthentication);
    }, 24 * 60 * 60 * 1000);

    process.on('exit', function () {
        clearInterval(interval);
    });
}

function authFunction(req, res, next) {
    if (process.env.IGNORE_AUTH) { // Used to ignore auth during tests, not sure how else to do it other than creating a local token
        next();
        return;
    }
    auth(req, res, next);
}

var deferred = q.defer();

getLocksmithConfigUrl()
    .then(getLocksmithConfiguration)
    .then(getLocksmithPublicKeys)
    .then(setupAuthentication)
    .then(setLocksmithInvalidationInterval)
    .then(function () {
        deferred.resolve(authFunction);
    });

module.exports = function () {
    return deferred.promise;
};
