module.exports = function (server) {

	server.get('/', function (req, res, next) {
		res.send('Hi!');
		next();
	});

	server.get('/:name', function (req, res, next) {
		res.send('Hi, ' + req.params.name + '!');
		next();
	});
};
