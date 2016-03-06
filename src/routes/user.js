var logger = require('../logger.js');

module.exports = function (server) {

	server.get('/user/:email', function (req, res, next) {
		res.send();
		next();
	});

	server.post('/user/:email', function (req, res, next) {
		logger.info("user with email " + req.params.email + " with results: " + req.body);
		var answers = JSON.parse(req.body).answers;
		var answer;
		var resume = { // based on jsonresume schema: http://jsonresume.org/schema/
			"basics": {
				"email": req.params.email,
				"location":{}
			},
			"work": [],
			"education": [],
			"skills": [],
			"languages": [],
			"interests": []
		};

		for (var i = 0, len = answers.length; i < len; i++) {
			answer = answers[i];
			switch (true) {
				case contains(answer.tags, 'name'):
					resume.name = answer.value;
					break;
				case contains(answer.tags, 'address') && contains(answer.tags, 'street'):
					resume.location.address = answer.value;
					break;
			}
		}
		next();
	});
};


function contains(array, element) {
	return array.indexOf(element) > -1;
}