// NPM dependency file
//
// this is read in by grunt-browserify and an output lib file is generated, which must be referenced in any html files
//
// Contents: any dependencies brought in via npm

//include jquery for bootstrap, also config so angular can use it instead
window.jQuery = $ = jQuery = require('jquery/dist/jquery.min');

require('angular/angular.min');
require('angular-route/angular-route.min');
require('bootstrap/dist/js/bootstrap');
require('leaflet/dist/leaflet');
require('leaflet/dist/leaflet');
window.d3 = require('d3/d3.min');
window.c3 = require('c3/c3.min');