var should = require('should');
var assert = require('assert');
var request = require('supertest');

describe('Services', function() {
	var url = 'http://localhost:8080/';

	before(function(done) {
		done();
	});

	describe('Search service', function() {
		it('***placeholder*** should return a basic set of results on basic query', function(done) {
			request(url)
				.get('/search')
				.end(function(err, res) {
					if (err) {
						throw err;
					}
					// this is should.js syntax, very clear
					res.should.have.status(400);
					res.body.should.equal(JSON.stringify({ 'results': [] }));
					done();
				});
		});
	});
});