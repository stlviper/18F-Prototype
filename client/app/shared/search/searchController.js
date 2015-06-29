'use strict';

openfdaviz.controller('SearchController', ['$scope', '$http', '$stateParams', "leafletData", function ($scope, $http, $stateParams, leafletData) {

  //Setting up the Leaflet Directive
  var mapZoom = 3;
  var dataPoints = [];

  $scope.fdaVizMapCenter = {
    lat: 38,
    lng: -96,
    zoom: mapZoom
  };
  $scope.defaults = {
    maxZoom: 10,
    minZoom: 1
  };
  $scope.layers = {
    baselayers: {
      xyz: {
        name: 'OpenStreetMap (XYZ)',
        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        type: 'xyz'
      }
    },
    overlays: {
      heat: {
        name: 'Heat Map',
        type: 'heat',
        data: dataPoints,
        layerOptions: {
          radius: 8,
          blur: 5,
          minOpacity: 0.7
        },
        visible: true,
        doRefresh: true
      }
    }

  };

  $scope.activeResultsTab = 'drugs';

  var startDate = new Date("December 31, 2004");
  var endDate = new Date("December 31, 2014");
  $scope.query = $stateParams.query;
  $scope.queryInProgress = false;

  var emptyResults = {
    drugs: [],
    devices: [],
    foods: []
  };

  $scope.results = emptyResults;

  $scope.activateResultsTab = function (activeTab) {
    $scope.activeResultsTab = activeTab;
  };

  angular.element(document).ready(function () {
    $scope.$on('dateChange', function (event, data) {
      startDate = data.minDate;
      endDate = data.maxDate;
      _filterSearchResults();
      _updateHeatmap();
    });
  });

  $scope.runQuery = function () {
    $stateParams.query = $scope.query;
    $scope.queryInProgress = true;
    $scope.results.drugs = [];
    $scope.results.foods = [];
    $scope.results.devices = [];
    $.when.apply($, [queryDrugs(), queryFoods(), queryDevices()]).done([_filterSearchResults, _updateHeatmap]);
  };

  var generalQuery = function () {
    $stateParams.query = $scope.query;
    var deferred = $.Deferred();
    $scope.queryInProgress = true;
    $scope.results = emptyResults;
    $http.get(config.resources.general + '?query=' + $scope.query)
      .success(function (resp) {
        $scope.results.drugs = resp.drug || [];
        $scope.results.devices = resp.device || [];
        $scope.results.foods = resp.food || [];
        deferred.resolve();
      })
      .error(function () {
        console.log("error requesting drugs");
      });
    return deferred;
  };
  $.when(generalQuery()).done([_filterSearchResults, _updateHeatmap]);

  function queryDrugs() {
    var deferred = $.Deferred();
    $http.get(config.resources.drugs + '?query=' + $scope.query)
      .success(function (resp) {
        if(!resp.error){
          $scope.results.drugs = resp;
        }
        deferred.resolve();
      })
      .error(function () {
        console.log("error requesting drugs");
      });
    return deferred;
    // current: status: '' || []
    // ideal: status: '', drug: [], food: [], device: []
  }

  function queryFoods() {
    var deferred = $.Deferred();
    $http.get(config.resources.foods + '?query=' + $scope.query)
      .success(function (resp) {
        if(!resp.error){
          $scope.results.foods = resp;
        }
        deferred.resolve();
      })
      .error(function () {
        console.log("error requesting foods");
      });
    return deferred;
  }

  function queryDevices() {
    var deferred = $.Deferred();
    $http.get(config.resources.devices + '?query=' + $scope.query)
      .success(function (resp) {
        if(!resp.error){
          $scope.results.devices = resp;
        }
        deferred.resolve();
      })
      .error(function () {
        console.log("error requesting devices");
      });
    return deferred;
  }

  function _updateHeatmap() {
    $scope.queryInProgress = false;
    $scope.layers.overlays.heat.data = [];
    // Plot food geodata points
    if (typeof $scope.results.foods !== 'undefined') {
      _addPointsToHeatmap($scope.results.foods);
    }
    // Plot drug geodata points
    if (typeof $scope.results.drugs !== 'undefined') {
      _addPointsToHeatmap($scope.results.drugs);
    }
    $scope.layers.overlays.heat.doRefresh = true;
    // This is what people currently recommend to get the map to update immediately
    leafletData.getMap().then(function(map) {
      map.invalidateSize();
    });
  }

  function _addPointsToHeatmap(category) {
    var perturbRadius = 0.004;
    for (var i in category) {
      if (typeof category[i].isDisplayable !== 'undefined') {
        if (typeof category[i].GeoLocation !== 'undefined') {
          if (typeof category[i].GeoLocation.lat !== 'undefined' &&
            typeof category[i].GeoLocation.lng !== 'undefined') {
            var lat = Number(category[i].GeoLocation.lat);
            var lng = Number(category[i].GeoLocation.lng);
            var latLng = [lat, lng];
            // Since the heatmap doesn't change when there are duplicate points,
            // perturb duplicate points a little so there is a visible difference
            // in the heatmap
            for (var j = 0; j < $scope.layers.overlays.heat.data.length; j++) {
              if (latLng[0] === $scope.layers.overlays.heat.data[j][0] &&
                latLng[1] === $scope.layers.overlays.heat.data[j][1]) {
                latLng = _perturbPoints(latLng, perturbRadius);
                break;
              }
            }
            if (category[i].isDisplayable) {
              $scope.layers.overlays.heat.data.push(latLng);
            }
          }
        }
      }
    }
  }

  function _perturbPoints(latLng, radius) {
    // Spread duplicate points in a small circle around the point
    var angle = 2*Math.PI*Math.random();
    latLng[0] += radius*Math.sin(angle);
    latLng[1] += radius*Math.cos(angle);
    return latLng;
  }

  function _filterSearchResults() {
    if (typeof $scope.results.foods !== 'undefined') {
      _filterFoodSearchResults($scope.results.foods);
    }
    if (typeof $scope.results.drugs !== 'undefined') {
      _filterDrugSearchResults($scope.results.drugs);
    }
    if (typeof $scope.results.devices !== 'undefined') {
      _filterDeviceSearchResults($scope.results.devices);
    }
  }

  function _filterFoodSearchResults(foods) {
    for (var i in foods) {
      if (typeof foods[i].isDisplayable === 'undefined') {
        foods[i].isDisplayable = true;
      }
      if (typeof foods[i].report_date !== 'undefined') {
        if (!_isDateInBounds(foods[i].report_date)) {
          foods[i].isDisplayable = false;
        } else {
          foods[i].isDisplayable = true;
        }
      }
    }
  }

  function _filterDrugSearchResults(drugs) {
    for (var i in drugs) {
      if (typeof drugs[i].isDisplayable === 'undefined') {
        drugs[i].isDisplayable = true;
      }
      if (typeof drugs[i].receivedate !== 'undefined') {
        if (!_isDateInBounds(drugs[i].receivedate)) {
          drugs[i].isDisplayable = false;
        } else {
          drugs[i].isDisplayable = true;
        }
      }
    }
  }

  function _filterDeviceSearchResults(devices) {
    for (var i in devices) {
      if (typeof devices[i].isDisplayable === 'undefined') {
        devices[i].isDisplayable = true;
      }
      if (typeof devices[i].date_of_event !== 'undefined') {
        if (!_isDateInBounds(devices[i].date_of_event)) {
          devices[i].isDisplayable = false;
        } else {
          devices[i].isDisplayable = false;
        }
      }
    }
  }

  function _isDateInBounds(dateToCheckString) {

    // Check year
    var reYear = /((19|20)\d{2})/;
    var dateToCheckYear = Number(dateToCheckString.match(reYear)[0]);

    var startDateYear = Number(startDate.getFullYear().toString());
    if (dateToCheckYear < startDateYear) {
      return false;
    }
    var endDateYear = Number(endDate.getFullYear().toString());
    if (dateToCheckYear > endDateYear) {
      return false;
    }

    // Check month

    // Check day

    return true;
  }

}]);