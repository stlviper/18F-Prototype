var expect = require('chai').expect;
var drugs = require('../../../api/controllers/fda_api');

describe('Testing Drugs Controller.', function () {

  beforeEach("Setup mock req/res objects", function () {
    this.mockReq = {
      swagger: {
        params: {}
      }
    };
    this.mockRes = {};

  });

  // This is primarily just a test endpoint and may end up being removed
  describe('Drugs eventRangeCount endpoint:', function () {
    describe('Should return counts for each term in range of 2010/05/21 to 2015/04/10', function () {
      it("Contains a value for at least one count", function (done) {
        var mockReq = this.mockReq;
        mockReq.swagger.params.start = {value: "20100521"};
        mockReq.swagger.params.end = {value: "20150410"};
        mockReq.swagger.params.field = {value: 'patient.patientsex'};
        drugs.tests.getRangeCountData(mockReq, function (data) {
          expect(data[0]).to.exist;
          expect(data[0].count).to.exist;
          done();
        });
      });
    });
    describe('Should return error object due to invalid field name', function () {
      it("Contains an error object", function (done) {
        var mockReq = this.mockReq;
        mockReq.swagger.params.start = {value: "20100521"};
        mockReq.swagger.params.end = {value: "20150410"};
        mockReq.swagger.params.field = {value: 'patient.patien2tsex'};

        drugs.tests.getRangeCountData(mockReq, function (data) {
          expect(data.error).to.exist;
          done();
        });

      });
    });
  });

  // Returns data by searching a field
  describe('Should return array of search result objects with field set as value', function () {
    it("Contains 11 valid result entries", function (done) {
      var mockReq = this.mockReq;
      mockReq.swagger.params.query = {value: "primarysourcecountry:us"};
      mockReq.swagger.params.limit = {value: "11"};
      mockReq.swagger.params.skip = {value: '20'};

      drugs.tests.getEventSearchData(mockReq, function (data) {
        expect(data.length).to.equal(11);
        expect(data[0]['@epoch']).to.exist;
        expect(data[10]['@epoch']).to.exist;
        var totalCorrectResults = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].primarysourcecountry.toLowerCase() == 'us') {
            totalCorrectResults++;
          }
        }
        expect(totalCorrectResults).to.equal(11);
        done();
      });
    });
  });
  describe('Should return error object due to invalid field name', function () {
    it("Contains an error object", function (done) {
      var mockReq = this.mockReq;
      mockReq.swagger.params.query = {value: "primarysource23country:us"};
      mockReq.swagger.params.limit = {value: "11"};
      mockReq.swagger.params.skip = {value: '20'};

      drugs.tests.getEventSearchData(mockReq, function (data) {
        expect(data.error).to.exist;
        done();
      });

    });
  });


  // Returns data by searching a field from all three categories (drug, food, devices)
  describe('Should return array of search result objects with field set as value', function () {
    it("Contains 11 valid result entries", function (done) {
      var mockReq = this.mockReq;
      mockReq.swagger.params.query = {value: "primarysourcecountry:us"};
      mockReq.swagger.params.limit = {value: "11"};
      mockReq.swagger.params.skip = {value: '20'};

      drugs.tests.getEventSearchData(mockReq, function (data) {
        expect(data.length).to.equal(11);
        expect(data[0]['@epoch']).to.exist;
        expect(data[10]['@epoch']).to.exist;
        var totalCorrectResults = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].primarysourcecountry.toLowerCase() == 'us') {
            totalCorrectResults++;
          }
        }
        expect(totalCorrectResults).to.equal(11);
        done();
      });
    });
  });


  describe('Should return an array of search results for Food events', function () {
    it('Contain an array of objects reflecting a group of food enforcement reports', function (done) {
      var mockReq = this.mockReq;
      mockReq.swagger.params.query = {value: "state:mo"};
      mockReq.swagger.params.limit = {value: "5"};
      mockReq.swagger.params.skip = {value: '20'};

      drugs.tests.getAPIData('food', 'enforcement', mockReq, [], function (data) {
        expect(data.length).to.equal(5);
        expect(data[0]['@epoch']).to.exist;
        expect(data[3]['@epoch']).to.exist;
        var totalCorrectResults = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].state.toLowerCase() == 'mo') {
            totalCorrectResults++;
          }
        }
        expect(totalCorrectResults).to.equal(5);
        done();
      });
    });
  });

  describe('Should return an array of counts for a Range of records in Food Events', function () {
    it('Contain an array of enforcement reports for a time range', function (done) {
      var mockReq = this.mockReq;
      mockReq.swagger.params.query = {value: "ca"};
      mockReq.swagger.params.limit = {value: "5"};
      mockReq.swagger.params.skip = {value: '0'};

      drugs.tests.getAPIData('device', 'enforcement', mockReq, ['state'], function (data) {
        expect(data.length).to.equal(5);
        expect(data[0]['@epoch']).to.exist;
        expect(data[3]['@epoch']).to.exist;
        var totalCorrectResults = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].state.toLowerCase() == 'ca') {
            totalCorrectResults++;
          }
        }
        expect(totalCorrectResults).to.equal(5);
        done();
      });
    });
  });

  describe('Should return an array of search results for Device events', function () {
    it('Contain an array of Device enforcement events', function (done) {
      var mockReq = this.mockReq;
      mockReq.swagger.params.query = {value: "mo"};
      mockReq.swagger.params.limit = {value: "5"};
      mockReq.swagger.params.skip = {value: '20'};

      drugs.tests.getAPIData('device', 'enforcement', mockReq, ['state'], function (data) {
        expect(data.length).to.equal(5);
        expect(data[0]['@epoch']).to.exist;
        expect(data[3]['@epoch']).to.exist;
        var totalCorrectResults = 0;
        for (var i = 0; i < data.length; i++) {
          if (data[i].state.toLowerCase() == 'mo') {
            totalCorrectResults++;
          }
        }
        expect(totalCorrectResults).to.equal(5);
        done();
      });
    });
  });

  describe('Should return an array of counts for a Range of records in Device Events', function () {
    it('Contain an array of device enforcement events for a time range', function (done) {
      var mockReq = this.mockReq;
      mockReq.swagger.params.start = {value: "20100521"};
      mockReq.swagger.params.end = {value: "20150410"};
      mockReq.swagger.params.field = {value: 'manufacturer_state'};
      drugs.tests.getAPIRangeData('device', 'event', 'report_date', mockReq, function (data) {
        expect(data[0]).to.exist;
        expect(data[0].count).to.exist;
        done();
      });
    });
  });
});