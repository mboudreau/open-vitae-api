var logger = require('../logger.js');
var dynasty = require('dynasty')({region: 'ap-northeast-1'});

module.exports = function (server) {

	server.get('/user/:email', function (req, res, next) {
		var table = dynasty.table('open-vitae');
		table.find(req.params.email).then(function (user) {
			res.send(user);
			next();
		}, function (error) {
			res.status(404).send('User not found');
			next();
		});
	});

	server.post('/user/:email', function (req, res, next) {
		logger.info("user with email " + req.params.email + " with results: " + JSON.stringify(req.body));
		var answers = req.body.answers;
		var answer;
		var table = dynasty.table('open-vitae');
		var resume = { // based on jsonresume schema: http://jsonresume.org/schema/
			"basics": {
				"email": req.params.email,
				"location": {}
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
					resume.basics.name = answer.value;
					break;
				case contains(answer.tags, 'address') && contains(answer.tags, 'street'):
					resume.basics.location.address = answer.value;
					break;
				case contains(answer.tags, 'address') && contains(answer.tags, 'suburb'):
					resume.basics.location.city = answer.value;
					break;
				case contains(answer.tags, 'address') && contains(answer.tags, 'state'):
					resume.basics.location.region = answer.value;
					break;
				case contains(answer.tags, 'address') && contains(answer.tags, 'postcode'):
					resume.basics.location.postalCode = answer.value;
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
					school.studyType = "Bachelor's Degree";
					break;
			}
		}
		table.insert({email: req.params.email, resume: resume}).then(function (resp) {
			logger.info("Dynamo responded: " + resp);
			res.status(201).send('User created.');
			next();
		}, function (err) {
			logger.error("DynamoDB error: " + err);
			next(err);
		});

	});


	server.post('/user/:email/allow/:company', function (req, res, next) {

	});
};


function contains(array, element) {
	if(array) {
		return array.indexOf(element) > -1;
	}
	return false;
}
