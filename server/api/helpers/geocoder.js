var fs = require('fs'),
  geocoderProvider = 'google',
  httpAdapter = 'http',
  geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, {});


global.geocodelist = null;

function loadGeocoder() {
  console.log("Loading Geocoder");
  var res = fs.readFileSync('./api/helpers/countries_geocoded.json');
  global.geocodelist = JSON.parse(res).data;
  return global.geocodelist;
}

module.exports = {

  geoCodeByISO3: function (ccc) {
    if (ccc.length !== 3) {
      return "Country code must only be three characters long";
    }

    if (global.geocodelist == null) {
      loadGeocoder();
    }
    for (var i = 0; i < global.geocodelist.length; i++) {
      if (global.geocodelist[i][10] === ccc.toUpperCase()) {
        return global.geocodelist[i];
      }
    }
  },

  geoCodeByISO2: function (cc) {
    if (cc.length !== 2) {
      return "Country code must only be two characters long";
    }

    if (global.geocodelist == null) {
      loadGeocoder();
    }
    for (var i = 0; i < global.geocodelist.length; i++) {
      if (global.geocodelist[i][9] === cc.toUpperCase()) {
        return global.geocodelist[i];
      }
    }
  },

  geoCodeString: function(information, callback){
    /*
     * NOTE: Information can be a string or an Array of strings for batch geocoding.
     * for more information see:  https://github.com/nchaulet/node-geocoder
     */
    geocoder.geocode(information, function(err, res) {
      callback(err, res);
    });

  }
};

