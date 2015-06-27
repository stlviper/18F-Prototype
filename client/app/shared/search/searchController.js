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
  },
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

  var minYear = '';
  var maxYear = '';
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
      minYear = data.minYear;
      maxYear = data.maxYear;
    });
  });

  $scope.runQuery = function () {
    $stateParams.query = $scope.query;
    $scope.queryInProgress = true;
    $scope.results = emptyResults;
    $.when.apply($, [queryDrugs(), queryFoods(), queryDevices()]).done(updateHeatmap);
  };

  var generalQuery = function () {
    $stateParams.query = $scope.query;
    var deferred = $.Deferred();
    $scope.queryInProgress = true;
    $scope.results = emptyResults;
    $http.get(config.resources.general + '?value=' + $scope.query)
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
  $.when(generalQuery()).done(updateHeatmap);

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

  function updateHeatmap() {
    $scope.queryInProgress = false;
    // Plot food geodata points
    if (typeof $scope.results.foods != 'undefined') {
      for (var i in $scope.results.foods) {
        if (typeof $scope.results.foods[i].GeoLocation != 'undefined') {
          if (typeof $scope.results.foods[i].GeoLocation.lat != 'undefined' &&
              typeof $scope.results.foods[i].GeoLocation.lng != 'undefined') {
            var lat = Number($scope.results.foods[i].GeoLocation.lat);
            var lng = Number($scope.results.foods[i].GeoLocation.lng);
            $scope.layers.overlays.heat.data.push([lat, lng]);
          }
        }
      }
    }
    // Plot drug geodata points
    if (typeof $scope.results.drugs != 'undefined') {
      for (var i in $scope.results.drugs) {
        if (typeof $scope.results.drugs[i].GeoLocation != 'undefined') {
          if (typeof $scope.results.drugs[i].GeoLocation.lat != 'undefined' &&
            typeof $scope.results.drugs[i].GeoLocation.lng != 'undefined') {
            var lat = Number($scope.results.drugs[i].GeoLocation.lat);
            var lng = Number($scope.results.drugs[i].GeoLocation.lng);
            // Since the heatmap doesn't change when there are duplicate points,
            // perturb duplicate points a little so there is a visible difference
            // in the heatmap
            for (var j=0; j<$scope.layers.overlays.heat.data.length; j++) {
              if (lat === $scope.layers.overlays.heat.data[j][0] &&
                  lng === $scope.layers.overlays.heat.data[j][1]) {
                // Spread duplicate points in a small circle around the point
                var angle = 2*Math.PI*Math.random();
                var spreadRadius = 0.004;
                lat += spreadRadius*Math.sin(angle);
                lng += spreadRadius*Math.cos(angle);
                break;
              }
            }
            $scope.layers.overlays.heat.data.push([lat, lng]);
          }
        }
      }
    }
  }
}]);