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

		var employer;
		var school;

		for (var i = 0, len = answers.length; i < len; i++) {
			answer = answers[i];
			switch (true) {
				case contains(answer.tags, 'name'):
					resume.name = answer.value;
					break;
				case contains(answer.tags, 'address') && contains(answer.tags, 'street'):
					resume.location.address = answer.value;
					break;
				case contains(answer.tags, 'address') && contains(answer.tags, 'suburb'):
					resume.location.city = answer.value;
					break;
				case contains(answer.tags, 'address') && contains(answer.tags, 'state'):
					resume.location.region = answer.value;
					break;
				case contains(answer.tags, 'address') && contains(answer.tags, 'postcode'):
					resume.location.postalCode = answer.value;
					break;
				case contains(answer.tags, 'employer') && contains(answer.tags, 'emp_name'):
					employer = {};
					resume.work.push(employer);
					employer.company = answer.value;
					break;
				case contains(answer.tags, 'employer') && contains(answer.tags, 'startdate'):
					employer.startDate = answer.value;
					break;
				case contains(answer.tags, 'employer') && contains(answer.tags, 'enddate'):
					employer.endDate = answer.value;
					break;
				case contains(answer.tags, 'employer') && contains(answer.tags, 'description'):
					employer.summary = answer.value;
					break;
				case contains(answer.tags, 'education') && contains(answer.tags, 'school_name'):
					school = {};
					resume.education.push(school);
					school.institution = answer.value;
					break;
				case contains(answer.tags, 'education') && contains(answer.tags, 'grad_year'):
					school.endDate = answer.value;
					break;
				case contains(answer.tags, 'education') && contains(answer.tags, 'award'):
					school.area = answer.value;
					break;
			}
		}
		next();
	});
};


function contains(array, element) {
	return array.indexOf(element) > -1;
}
