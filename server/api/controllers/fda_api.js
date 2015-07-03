'use strict';
var request = require('request'),
  geoCoder = require('../helpers/geocoder'),
  async = require('async');

//'https://api.fda.gov/drug/event.json?search=receivedate:[20040101+TO+20150101]&count=patient.patientsex',
//'http://54.165.240.32/drug/label.json?search=effective_time:[20090601+TO+20140731]&limit=50',


var FDA_DRUG_EVENT = 'https://api.fda.gov/drug/';


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

var formatSearchFields = function (value, fields) {
  var retSearchField = '';
  if (fields && fields instanceof Array) {
    for (var idx in fields) {
      if (typeof fields[idx] === 'string' || fields[idx] instanceof String) {
        retSearchField += fields[idx].trim() + ':' + value.trim() + '+';
      }
    }
    //NOTE: Remove the last + character
    return retSearchField.substring(0, retSearchField.length - 1);
  }
  else {
    return '';
  }
};

var geoCodeFoodData = function (data, callback) {
  if (data && data instanceof Array) {
    data.map(function (item, index, array) {
      if (item.state && item.state.length > 0) {
        array[index].GeoLocation = geoCoder.geoCodeState(item.state);
      }
      else if (item.country && item.country.length > 0) {
        array[index].GeoLocation = geoCoder.geoCodeCountry(item.country);
      }
    });
    callback(data);
  }
  else {
    callback([]);
  }
};

var geoCodeDrugData = function (data, callback) {

  if (data && data instanceof Array) {
    data.map(function (item, index, array) {
      if (item.state && item.state.length > 0) {
        array[index].GeoLocation = geoCoder.geoCodeState(item.state);
      }
      else if (item.country && item.country.length > 0) {
        array[index].GeoLocation = geoCoder.geoCodeCountry(item.country);
      }
    });
    callback(data);
  }
  else {
    callback([]);
  }
};

var geoCodeDeviceData = function (data, callback) {
  if (data && data instanceof Array) {
    data.map(function (item, index, array) {
      if (item.state && item.state.length > 0) {
        array[index].GeoLocation = geoCoder.geoCodeState(item.state);
      }
      else if (item.country && item.country.length > 0) {
        array[index].GeoLocation = geoCoder.geoCodeCountry(item.country);
      }
    });
    callback(data);
  }
  else {
    callback([]);
  }
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

var getAPIData = function (endPointBase, typeOfEngPoint, req, fields, callback) {
  var limit = 100, start = 0, search;
  if (req.swagger.params.limit) {
    limit = req.swagger.params.limit.value || 100;
  }
  if (req.swagger.params.skip) {
    start = req.swagger.params.skip.value || 0;
  }
  if (req.swagger.params.query) {
    search = req.swagger.params.query.value;
  }
  if (fields.length > 0) {
    search = formatSearchFields(req.swagger.params.query.value, fields);
  }
  var fdaUrl = FDA_END_POINTS[endPointBase] + FDA_END_TYPES[typeOfEngPoint] + '?search=' + search;

  if (limit) {
    fdaUrl += '&limit=' + limit;
  }
  if (start) {
    fdaUrl += '&skip=' + start;
  }
  getDataFromFdaApi(fdaUrl, callback);
};

var getAPIRangeData = function (endPointBase, typeOfEngPoint, datefield, req, callback) {
  var fdaUrl = FDA_END_POINTS[endPointBase] + FDA_END_TYPES[typeOfEngPoint] + "?search=" + datefield
    + ':[' + req.swagger.params.start.value + '+TO+' + req.swagger.params.end.value + ']&count=' + req.swagger.params.field.value;
  getDataFromFdaApi(fdaUrl, callback);
};

function getAggregateSplashSearchData(req, res) {
  async.parallel([
      function (callback) {
        var chosenFields = [];
        if (req.swagger.params.deviceFields.value) {
          chosenFields = req.swagger.params.deviceFields.value.split(',');
        }
        getAPIData('device', 'enforcement', req, chosenFields, function (data) {
          geoCodeDeviceData(data, function (data) {
            callback(null, {key: 'device', value: data});
          });
        });
      },
      function (callback) {
        var chosenFields = [];
        if (req.swagger.params.foodFields.value) {
          chosenFields = req.swagger.params.foodFields.value.split(',');
        }
        getAPIData('food', 'enforcement', req, chosenFields, function (data) {
          geoCodeFoodData(data, function (data) {
            callback(null, {key: 'food', value: data});
          });
        });
      },
      function (callback) {
        var chosenFields = [];
        if (req.swagger.params.drugFields.value) {
          chosenFields = req.swagger.params.drugFields.value.split(',');
        }
        getAPIData('drug', 'enforcement', req, chosenFields, function (data) {
          geoCodeDrugData(data, function (data) {
            callback(null, {key: 'drug', value: data});
          });
        });

      }
    ],
    function (err, data) {
      var returnData = {drug: [], device: [], food: []};
      for (var idx in data) {
        if (data[idx].value instanceof  Array) {
          returnData[data[idx].key] = data[idx].value;
        }
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


module.exports = {
  aggregateSplashSearch: function (req, res) {
    getAggregateSplashSearchData(req, res);
  },

  drugEventSearch: function (req, res) {
    var chosenFields = [];
    if (req.swagger.params.fields.value) {
      chosenFields = req.swagger.params.fields.value.split(',');
    }
    getAPIData('drug', 'enforcement', req, chosenFields, function (data) {
      geoCodeDrugData(data, function (data) {
        res.json(data);
      });
    });
  },

  drugEventRangeCount: function (req, res) {
    getRangeCountData(req, function (data) {
      res.json(data);
    });
  },

  deviceEventSearch: function (req, res) {
    var chosenFields = [];
    if (req.swagger.params.fields.value) {
      chosenFields = req.swagger.params.deviceFields.value.split(',');
    }
    getAPIData('device', 'enforcement', req, chosenFields, function (data) {
      geoCodeDeviceData(data, function (processedData) {
        res.json(processedData);
      });
    });
  },

  deviceEventRangeCount: function (req, res) {
    getAPIRangeData('device', 'enforcement', 'report_date', req, function (data) {
      res.json(data);
    });
  },

  foodEventSearch: function (req, res) {
    var chosenFields = [];
    if (req.swagger.params.fields.value) {
      chosenFields = req.swagger.params.fields.value.split(',');
    }
    getAPIData('food', 'enforcement', req, chosenFields, function (data) {
      geoCodeFoodData(data, function (data) {
        res.json(data);
      });
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