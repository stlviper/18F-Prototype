'use strict';

openfdaviz.controller('SearchController', ['$scope', '$http', '$stateParams', "leafletData", function ($scope, $http, $stateParams, leafletData) {

  //Setting up the Leaflet Directive
  var mapZoom = 4;
  var dataPoints = [];

  $scope.fdaVizMapCenter = {
    lat: 38,
    lng: -96,
    zoom: mapZoom
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
          radius: 6,
          blur: 2,
          minOpacity: 0.6
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

  $scope.results = {
    drugs: [],
    devices: [],
    foods: []
  };

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
    $.when.apply($, [generalQuery(), queryDrugs(), queryFoods(), queryDevices()]).done(updateHeatmap);
  };

  var generalQuery = function () {
    var deferred = $.Deferred();
    $scope.queryInProgress = true;
    $http.get(config.resources.general + '?value=' + $scope.query)
      .success(function (resp) {
        $scope.results.drugs = resp.drug || [];
        $scope.results.devices = resp.device || [];
        $scope.results.foods = resp.food || [];
        deferred.resolve();
        $scope.queryInProgress = false;
      })
      .error(function () {
        console.log("error requesting drugs");
      });
    return deferred;
  };
  $.when.apply($, [generalQuery()]).done(updateHeatmap);

  function queryDrugs() {
    var deferred = $.Deferred();
    $http.get(config.resources.drugs + '?query=' + $scope.query)
      .success(function (resp) {
        $scope.results.drugs = resp;
        deferred.resolve();
      })
      .error(function () {
        console.log("error requesting drugs");
      });
    return deferred;
  }

  function queryFoods() {
    var deferred = $.Deferred();
    $http.get(config.resources.foods + '?query=' + $scope.query)
      .success(function (resp) {
        $scope.results.foods = resp;
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
        $scope.results.devices = resp;
        deferred.resolve();
      })
      .error(function () {
        console.log("error requesting devices");
      });
    return deferred;
  }

  function updateHeatmap() {
    // Plot food geodata points
    if (typeof $scope.results.foods != 'undefined') {
      for (var i in $scope.results.foods) {
        if (typeof $scope.results.foods[i].GeoLocation != 'undefined') {
          if (typeof $scope.results.foods[i].GeoLocation.lat != 'undefined' &&
              typeof $scope.results.foods[i].GeoLocation.lng != 'undefined') {
            var lat = $scope.results.foods[i].GeoLocation.lat;
            var lng = $scope.results.foods[i].GeoLocation.lng;
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
            var lat = $scope.results.drugs[i].GeoLocation.lat;
            var lng = $scope.results.drugs[i].GeoLocation.lng;
            $scope.layers.overlays.heat.data.push([lat, lng]);
          }
        }
      }
    }
  }
}]);