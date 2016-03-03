/* global process:true, __dirname:true */
/*jslint node: true */

'use strict';


var express = require('express'),
	bodyParser = require('body-parser'),
	compression = require('compression'),
	cors = require('cors'),
	globby = require('globby'),
	path = require('path'),
	q = require('q'),
	logger = require('./logger');

function createExpressApp() {
	var pkg = require('./../package.json');

	var app = express();
	app.options('*', cors()); // Allow all preflight cors check
	app.use(cors({origin: true}));
	app.use(bodyParser.json());
	app.use(compression());

	app.on('NotFound', function (req, res, next) {
		logger.info('404', 'No route that matches request for ' + req.url);
		res.send(404, req.url + ' was not found');
	});


	// Add Routes
	globby(['./routes/**/!(*.spec).js'], {cwd: __dirname}).then(function (paths) {
		for (var i = 0, len = paths.length; i < len; i++) {
			logger.info('Adding route "' + paths[i] + '"');
			require(paths[i])(app);
		}
	});

	return q(app);
}

function Server(options) {
	this.port = options.port || 9700;
}

Server.prototype.start = function () {
	var that = this;

	logger.info('Starting Web server on port %d', that.port);

	return createExpressApp()
		.then(function (app) {
			var deferred = q.defer();
			that.server = app.listen(that.port, null, null, function () {
				logger.info('Web server up on port %d', that.port);
				deferred.resolve(app);
			});
			return deferred.promise.timeout(5000, 'Server failed to start');
		});
};

Server.prototype.stop = function () {
	var that = this;
	if (this.server) {
		logger.info('Stopping Web server up on port %d', that.port);
		var deferred = q.defer();
		this.server.close(function () {
			that.server = null;
			deferred.resolve();
		});
		return deferred.promise.timeout(5000, 'Server failed to close');
	}
	return q();
};

module.exports.create = function (options) {
	return new Server(options);
};
