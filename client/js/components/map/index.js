'use strict';

module.exports = angular.module('openfdaviz.map', [
	require('./controls').name
]).controller('MapController', require('./mapController'));