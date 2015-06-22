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