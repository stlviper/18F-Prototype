'use strict';
var request = require('request'),
  async = require('async');

//'https://api.fda.gov/drug/event.json?search=receivedate:[20040101+TO+20150101]&count=patient.patientsex',
//'http://54.165.240.32/drug/label.json?search=effective_time:[20090601+TO+20140731]&limit=50',


var FDA_DRUG_EVENT = 'https://api.fda.gov/drug/';
var FDA_DEVICE_EVENT = 'https://api.fda.gov/device/';
var FDA_FOOD_EVENT = 'https://api.fda.gov/food/';

module.exports = {

  aggregateSplashSearch: function (req, res) {
    getAggregateSplashSearchData(req, res)
  },

  drugEventSearch: function (req, res) {
    getEventSearchData(req, function (data) {
      res.json(data);
    });
  },

  drugEventRangeCount: function (req, res) {
    getRangeCountData(req, function (data) {
      res.json(data);
    });
  },

  deviceEventSearch: function (req, res) {
    getAPIData('device', 'event', req, function (data) {
      res.json(data);
    });
  },

  deviceEventRangeCount: function (req, res) {
    getAPIRangeData('device', 'event', 'receivedate', req, function (data) {
      res.json(data);
    });
  },

  foodEventSearch: function (req, res) {
    getAPIData('food', 'enforcement', req, function (data) {
      res.json(data);
    });
  },

  foodEventRangeCount: function (req, res) {
    getAPIRangeData('food', 'enforcement', 'recall_initiation_date', req, function (data) {
      res.json(data);
    });
  },

  tests: {
    getRangeCountData: getRangeCountData,
    getEventSearchData: getEventSearchData
  }

};

function getAggregateSplashSearchData(req, res) {
  async.parallel([
      function (callback) {
        var fdaUrl = FDA_DRUG_EVENT + 'event.json?limit=2&search=patient.drug.openfda.brand_name:"' + req.swagger.params.value.value + '"+patient.drug.openfda.brand_name:"' + req.swagger.params.value.value + '"';
        getDataFromFdaApi(fdaUrl, function (data) {
          callback(null, data);
        });
      }
    ],
    function (err, data) {
      res.json(data)
    }
  );
}

function getRangeCountData(req, callback) {
  var fdaUrl = FDA_DRUG_EVENT + 'event.json?search=receivedate:[' + req.swagger.params.start.value + '+TO+' + req.swagger.params.end.value + ']&count=' + req.swagger.params.field.value;
  getDataFromFdaApi(fdaUrl, function (data) {
    callback(data);
  });
}

function getEventSearchData(req, callback) {
  var limit = req.swagger.params.limit.value || 100;
  var start = req.swagger.params.skip.value || 0;
  var fdaUrl = FDA_DRUG_EVENT + 'event.json?search=' + req.swagger.params.query.value + '&limit=' + limit + '&skip=' + start;

  getDataFromFdaApi(fdaUrl, function (data) {
    callback(data);
  });
}

function getDataFromFdaApi(fdaUrl, callback) {
  request.get({
      url: encodeURI(fdaUrl),
      json: true
    },
    function (error, response, body) {
      if (!error && (response.statusCode == 200 || 404)) {
        callback(response.statusCode == 404 ? body : body.results);
      } else {
        callback({error: 'Request Failed'});
      }
    }
  );
}


var FDA_END_POINTS = {
  device: 'https://api.fda.gov/device/',
  drug: 'https://api.fda.gov/drug/',
  food: 'https://api.fda.gov/food/'
};
var FDA_END_TYPES = {
  event: 'event.json',
  enforcement: 'enforcement.json',
  label: 'label.json'
};

var getAPIData = function (endPointBase, typeOfEngPoint, req, callback) {
  var limit = req.swagger.params.limit.value || 100;
  var start = req.swagger.params.skip.value || 0;
  var fdaUrl = FDA_END_POINTS[endPointBase]  + FDA_END_TYPES[typeOfEngPoint] + '?search=' + req.swagger.params.query.value + '&limit=' + limit + '&skip=' + start;
  getDataFromFdaApi(fdaUrl, callback);
};

var getAPIRangeData = function (endPointBase, typeOfEngPoint, datefield, req, callback) {
  var fdaUrl = FDA_END_POINTS[endPointBase] + FDA_END_TYPES[typeOfEngPoint] + "?search=" + datefield
    + ':[' + req.swagger.params.start.value + '+TO+' + req.swagger.params.end.value + ']&count=' + req.swagger.params.field.value;
  getDataFromFdaApi(fdaUrl, callback);
};


