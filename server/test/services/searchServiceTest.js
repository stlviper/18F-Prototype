var should = require('should');
var assert = require('assert');
var request = require('supertest');

var server = require('../../main');

describe('Services', function() {
	before(function(done) {
		done();
	});

	describe('Search service', function() {
		it('***placeholder*** should return a basic set of results on basic query', function(done) {
			request(server)
				.get('/search')
				.set('Accept', 'application/json')
				.expect('Content-Type', 'text/html; charset=utf-8')
				.expect(404)
				.end(function(err, res) {
					should.not.exist(err);
					res.body.should.eql({});
					done();
				});
		});
	});
});