'use strict';
var request = require('request'),
  geoCoder = require('../helpers/geocoder'),
  async = require('async');

//'https://api.fda.gov/drug/event.json?search=receivedate:[20040101+TO+20150101]&count=patient.patientsex',
//'http://54.165.240.32/drug/label.json?search=effective_time:[20090601+TO+20140731]&limit=50',


var FDA_DRUG_EVENT = 'https://api.fda.gov/drug/';
var FDA_DEVICE_EVENT = 'https://api.fda.gov/device/';
var FDA_FOOD_EVENT = 'https://api.fda.gov/food/';


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

var geoCodeFoodData = function (data, callback) {
  var geoKeys = [];

  if (data && data instanceof Array) {
    data.map(function (item, index, array) {
      if (item.state && item.state.length > 0) {
        array[index].GeoLocation = geoCoder.geoCodeState(item.state);
      }
      else if (item.country && item.country.length > 0) {
        array[index].GeoLocation = geoCoder.geoCodeCountry(item.country);
      }
    });

    if (geoKeys.length > 0) {
      geoCoder.geoCodeString(geoKeys, function (err, data) {
        if (data) {

        }
      });
    } else {

      callback(null, {key: 'food', value: data});
    }
  }
  else {
    callback(null, {key: 'food', value: []});
  }
};
var geoCodeDeviceData = function (data, callback) {
  var geoKeys = [];

  if (data && data instanceof Array) {
    data.map(function (item, index, array) {
      if (item.state && item.state.length > 0) {
        array[index].GeoLocation = geoCoder.geoCodeState(item.state);
      }
      else if (item.country && item.country.length > 0) {
        array[index].GeoLocation = geoCoder.geoCodeCountry(item.country);
      }
    });

    if (geoKeys.length > 0) {
      geoCoder.geoCodeString(geoKeys, function (err, data) {
        if (data) {

        }
      });
    } else {

      callback(null, {key: 'food', value: data});
    }
  }
  else {
    callback(null, {key: 'food', value: []});
  }
};

var geoCodeDrugData = function (data, callback) {
  var processedData = [];
  if (data && data instanceof Array) {
    data.map(function (item, index, array) {
      if (item.primarysourcecountry) {
        array[index].GeoLocation = geoCoder.geoCodeCountry(item.primarysourcecountry);
      }
    });
    callback(null, {key: 'drug', value: data})
  }
  else {
    callback(null, {key: 'drug', value: []});
  }
};


function getAggregateSplashSearchData(req, res) {
  async.parallel([

      function (callback) {
        var fdaUrl = FDA_DRUG_EVENT + 'event.json?limit=100&search=patient.drug.openfda.brand_name:"' + req.swagger.params.value.value + '"+patient.drug.openfda.brand_name:"' + req.swagger.params.value.value + '"';
        getDataFromFdaApi(fdaUrl, function (data) {
          geoCodeDrugData(data, callback);
        });
      },

      function (callback) {
        var fdaUrl = FDA_FOOD_EVENT + 'enforcement.json?limit=100&search=product_description:"' + req.swagger.params.value.value + '"+reason_for_recall:"' + req.swagger.params.value.value + '"';
        getDataFromFdaApi(fdaUrl, function (data) {
          geoCodeFoodData(data, callback);
        });
      },

      function (callback) {
        var fdaUrl = FDA_DEVICE_EVENT + 'event.json?limit=100&search=device.brand_name:"' + req.swagger.params.value.value + '"+device.generic_name:"' + req.swagger.params.value.value + '"+device.manufacturer_d_name:"' + req.swagger.params.value.value + '"';
        getDataFromFdaApi(fdaUrl, function (data) {
          callback(null, {key: 'device', value: data});
        });
      }
    ],
    function (err, data) {
      var returnData = {drug: [], device: [], food: []};
      for (var idx in data) {
        returnData[data[idx].key] = data[idx].value;
      }
      var statusMessage = '';
      statusMessage += returnData.drug.length > 0 ? returnData.drug.length + ' drug records, ' : 'No drug data, ';
      statusMessage += returnData.food.length > 0 ? returnData.food.length + ' food records, ' : 'No food data, ';
      statusMessage += returnData.device.length > 0 ? returnData.device.length + ' device records, ' : 'No device data ';
      returnData.status = statusMessage;
      res.json(returnData);
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

var getAPIData = function (endPointBase, typeOfEngPoint, req, callback) {
  var limit = req.swagger.params.limit.value || 100;
  var start = req.swagger.params.skip.value || 0;
  var fdaUrl = FDA_END_POINTS[endPointBase] + FDA_END_TYPES[typeOfEngPoint] + '?search=' + req.swagger.params.query.value + '&limit=' + limit + '&skip=' + start;
  getDataFromFdaApi(fdaUrl, callback);
};

var getAPIRangeData = function (endPointBase, typeOfEngPoint, datefield, req, callback) {
  var fdaUrl = FDA_END_POINTS[endPointBase] + FDA_END_TYPES[typeOfEngPoint] + "?search=" + datefield
    + ':[' + req.swagger.params.start.value + '+TO+' + req.swagger.params.end.value + ']&count=' + req.swagger.params.field.value;
  getDataFromFdaApi(fdaUrl, callback);
};


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
    getEventSearchData: getEventSearchData,
    FDA_END_POINTS: FDA_END_POINTS,
    FDA_END_TYPES: FDA_END_TYPES,
    getAPIData: getAPIData,
    getAPIRangeData: getAPIRangeData
  }
};