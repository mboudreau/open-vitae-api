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

		var employer, school;

		find(answers, ['name'], function (value) {
			resume.basics.name = value;
		});
		find(answers, ['address', 'street'], function (value) {
			resume.basics.location.address = value;
		});
		find(answers, ['address', 'suburb'], function (value) {
			resume.basics.location.city = value;
		});
		find(answers, ['address', 'state'], function (value) {
			resume.basics.location.region = value;
		});
		find(answers, ['address', 'postcode'], function (value) {
			resume.basics.location.postalCode = value.amount;
		});
		find(answers, ['employer', 'emp_name'], function (value) {
			employer = {};
			resume.work.push(employer);
			employer.company = value;
		});
		find(answers, ['employer', 'startdate'], function (value) {
			employer.startDate = value;
		});
		find(answers, ['employer', 'enddate'], function (value) {
			employer.endDate = value;
		});
		find(answers, ['employer', 'description'], function (value) {
			employer.summary = value;
		});
		find(answers, ['education', 'school_name'], function (value) {
			school = {};
			resume.education.push(school);
			school.institution = value;
		});
		find(answers, ['education', 'grad_year'], function (value) {
			school.endDate = value.amount;
		});
		find(answers, ['education', 'award'], function (value) {
			school.area = value;
			school.studyType = "Bachelor's Degree";
		});

		logger.debug(resume);

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

function find(answers, tags, cb) {
	for (var i = 0, len = answers.length; i < len; i++) {
		var answer = answers[i];
		if (contains(answer.tags, tags)) {
			cb(answer.value);
			return;
		}
	}
}


function contains(array, elements) {
	if (array) {
		var bool = true;
		for (var i = 0, len = elements.length; i < len; i++) {
			bool = bool && array.indexOf(elements[i]) != -1
		}
		return bool;
	}
	return false;
}
