/* global describe:true, before:true, after:true, it:true*/

'use strict';

var request = require('supertest'),
    expect = require('chai').expect,
    sinon = require("sinon"),
    serverFactory = require("../server.js");
/*
describe("candidate route", function () {

    var port = 8000,
        baseUrl = 'http://localhost:' + port,
        server;

    before(function (done) {
        server = serverFactory.create({port: port});
        server.start().then(function () {
            done()
        });
    });

    after(function (done) {
        server.stop().then(function () {
            done()
        });
    });

    describe("/candidate", function () {
        var sandbox;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function () {
            sandbox.restore();
        });

        it('will return all the candidates', function (done) {
            var searchStub = sandbox.stub(searchService, 'search', allCandidatesCallback);

            request(baseUrl)
                .get('/candidate')
                .set('Accept', 'application/json')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) {
                        return done(err);
                    }

                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.ownProperty('hits');
                    expect(res.body.hits.total).to.equal(2);
                    expect(searchStub.called).to.be.true;

                    done();
                });
        });
    });

    describe("/candidate/id", function () {
        var sandbox;

        beforeEach(function () {
            sandbox = sinon.sandbox.create();
        });

        afterEach(function () {
            sandbox.restore();
        });

        it('will return a specific candidate', function (done) {

            var searchStub = sandbox.stub(searchService, 'search', singleCandidateCallback);

            request(baseUrl)
                .get('/candidate/12345')
                .set('Accept', 'application/json')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(searchStub.called).to.be.true;

                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.ownProperty('hits');
                    expect(res.body.hits.total).to.equal(1);

                    expect(res.body.hits.hits[0]._source.ApplicantDetails.Id).to.equal("12345");

                    done();
                });
        });
    });
});*/
