var fs = require('fs'),
  geocoderProvider = 'google',
  httpAdapter = 'http',
  geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, {});


global.geocodelist = null;
var _stateGeoCodeList = null;

function loadCountryGeocoder() {
  var res = fs.readFileSync('./api/helpers/countries_geocoded.json');
  global.geocodelist = JSON.parse(res).data;
  return global.geocodelist;
}

var _loadStateGeoCoder = function () {
  console.log(process.cwd());
  var res = fs.readFileSync('./api/helpers/state_latlon.json');
  _stateGeoCodeList = JSON.parse(res);
  return _stateGeoCodeList;
};

module.exports = {

  geoCodeByISO3: function (ccc) {
    if (ccc.length !== 3) {
      return "Country code must only be three characters long";
    }

    if (global.geocodelist === null) {
      loadCountryGeocoder();
    }
    for (var i = 0; i < global.geocodelist.length; i++) {
      if (global.geocodelist[i][10] === ccc.toUpperCase()) {
        return {lat: global.geocodelist[i][12], lng: global.geocodelist[i][13]};
      }
    }
  },

  geoCodeByISO2: function (cc) {
    if (cc.length !== 2) {
      return "Country code must only be two characters long";
    }

    if (global.geocodelist === null) {
      loadCountryGeocoder();
    }
    for (var i = 0; i < global.geocodelist.length; i++) {
      if (global.geocodelist[i][9] === cc.toUpperCase()) {
        return {lat: global.geocodelist[i][12], lng: global.geocodelist[i][13]};
      }
    }
  },

  geoCodeCountry: function (country) {
    if (country.length === 2) {
      return this.geoCodeByISO2(country);
    }
    else if (country.length === 3) {
      return this.geoCodeByISO3(country);
    }
    else {
      return "Country Code format not supported(ISO3 or ISO2 only)";
    }
  },

  geoCodeState: function (state) {
    if (_stateGeoCodeList === null) {
      _loadStateGeoCoder();
    }
    for (var i = 0; i < _stateGeoCodeList.length; i++) {
      if (_stateGeoCodeList[i].STATE === state.toUpperCase()) {
        return {lat: _stateGeoCodeList[i].LATITUDE, lng: _stateGeoCodeList[i].LONGITUDE};
      }
    }
  },

  geoCodeString: function (information, callback) {
    /*
     * NOTE: Information can be a string or an Array of strings for batch geocoding.
     * for more information see:  https://github.com/nchaulet/node-geocoder
     */
    geocoder.geocode(information, function (err, res) {
      callback(err, res);
    });

  }
};

