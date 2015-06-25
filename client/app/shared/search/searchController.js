'use strict';

openfdaviz.controller('SearchController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {

  //Setting up the Leaflet Directive
  var mapZoom = 4;
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
        data: [
          [38.3, -92],
          [38.4623, -92]
        ],
        layerOptions: {
          radius: 20,
          blur: 10
        },
        visible: true
      }
    }

  };


  $scope.activeTab = 'results';

  var minYear = '';
  var maxYear = '';
  $scope.query = $stateParams.searchQuery;

  $scope.results = {
    drugs: [],
    devices: [],
    foods: []
  };

  $scope.activateSearchTab = function (activeTab) {
    $scope.activeTab = activeTab;
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
  generalQuery();
  updateHeatmap();

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
    $scope.results.devices
  }
}]);