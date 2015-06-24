fs = require('fs');

global.geocodelist = null;

function loadGeocoder() {
    console.log("Loading Geocoder");
    var res = fs.readFileSync('./api/helpers/countries_geocoded.json');
    global.geocodelist = JSON.parse(res).data;
    return global.geocodelist;
}

module.exports = {

    geoCodeByISO3: function(ccc) {
        if(ccc.length !== 3 ) {
            return "Country code must only be three characters long";
        }

        if(global.geocodelist == null) {
            loadGeocoder();
        }
        for(var i = 0; i < global.geocodelist.length; i++) {
            if(global.geocodelist[i][10] === ccc.toUpperCase()) {
                return global.geocodelist[i];
            }
        }
    },

    geoCodeByISO2: function (cc) {
        if(cc.length !== 2) {
            return "Country code must only be two characters long";
        }

        if(global.geocodelist == null) {
            loadGeocoder();
        }
        for(var i = 0; i < global.geocodelist.length; i++) {
            if(global.geocodelist[i][9] === cc.toUpperCase()) {
                return global.geocodelist[i];
            }
        }
    }
};

