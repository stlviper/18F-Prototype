var should = require('should');
var request = require('supertest');
var assert = require("assert");
var expect = require('chai').expect;

var geocoder = require('../../../api/helpers/geocoder');

describe('Method geocoder.geoCodeCountry()', function () {
  it('Should throw an error for a length longer then 3 characters', function () {
    var res = geocoder.geoCodeCountry('USAB');
    assert.equal("Country Code format not supported(ISO3 or ISO2 only)", res);
  });
  it('Should return 33Lat, 65Lng for AF', function () {
    assert.doesNotThrow(function () {
      var res = geocoder.geoCodeCountry('AF');
      assert.equal(res.lat, 33);
      assert.equal(res.lng, 65);
    });
  });

  it('Should return 38Lat, -97Lng for US', function () {
    assert.doesNotThrow(function () {
      var res = geocoder.geoCodeCountry('US');
      assert.equal(res.lat, 38);
      assert.equal(res.lng, -97);
    });
  });
});

describe('Method geoCoder.geoCodeState()', function () {
  it('Should return an error message for an unsupported initial type', function () {
    assert.doesNotThrow(function () {
      var res = geocoder.geoCodeState('ARK');
      assert.equal("The state is to long. Only two letter initials are supported", res);
    });
  });
  it('Should return 34.95Lat, -92Lng for state AR', function () {
    assert.doesNotThrow(function () {
      var res = geocoder.geoCodeState('AR');
      assert.equal(res.lat, 34.9513);
      assert.equal(res.lng, -92.3809);
    });
  });
});

describe('USA should thrown an error on geoCodeByISO2 method', function () {
  it("Should throw error", function () {
    var res = geocoder.geoCodeByISO2('USA');
    assert.equal("Country code must only be two characters long", res);
  });
});

describe('US latitude,longitude', function () {
  it('should be', function () {
    assert.doesNotThrow(function () {
      var res = geocoder.geoCodeByISO2('US');
      assert.equal(res.lat, 38);
      assert.equal(res.lng, -97);
    });
  });
});

describe('AF latitude,longitude', function () {
  it('should be', function () {
    assert.doesNotThrow(function () {
      var res = geocoder.geoCodeByISO2('AF');
      assert.equal(res.lat, 33);
      assert.equal(res.lng, 65);
    });
  });
});

describe('US should thrown an error on geoCodeByISO3 method', function () {
  it("Should throw error", function () {
    var res = geocoder.geoCodeByISO3('US');
    assert.equal("Country code must only be three characters long", res);
  });
});

describe('USA latitude,longitude', function () {
  it('should be', function (done) {
    assert.doesNotThrow(function () {
      var res = geocoder.geoCodeByISO3('USA');
      assert.equal(res.lat, 38);
      assert.equal(res.lng, -97);
      done();
    });
  });
});