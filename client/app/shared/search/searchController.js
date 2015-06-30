'use strict';

openfdaviz.controller('SearchController', ['$scope', '$http', '$stateParams', "leafletData", function ($scope, $http, $stateParams, leafletData) {

  //Setting up the Leaflet Directive
  var mapZoom = 1;
  var foodsMapPoints = [];
  var drugsMapPoints = [];
  var devicesMapPoints = [];

  $scope.fdaVizMapCenter = {
    lat: 0,
    lng: 0,
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
      foods: {
        name: 'Food',
        type: 'heat',
        data: foodsMapPoints,
        layerOptions: {
          radius: 8,
          blur: 5,
          minOpacity: 0.7
        },
        visible: true,
        doRefresh: true
      },
      drugs: {
        name: 'Drugs',
        type: 'heat',
        data: drugsMapPoints,
        layerOptions: {
          radius: 8,
          blur: 5,
          minOpacity: 0.7
        },
        visible: true,
        doRefresh: true
      },
      devices: {
        name: 'Devices',
        type: 'heat',
        data: devicesMapPoints,
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

  $scope.activeResultsTab = 'foods';

  var startDate = new Date("December 31, 1970");
  var endDate = new Date();
  $scope.input = {
    searchText: $stateParams.query
  };
  $scope.devicesQueryInProgress = false;
  $scope.drugsQueryInProgress = false;
  $scope.foodsQueryInProgress = false;

  var emptyResults = {
    drugs: [],
    devices: [],
    foods: []
  };

  $scope.results = emptyResults;

  $scope.handleKeypress = function($event){
    if($event.keyCode === 13){
      $scope.runQuery();
    }
  };

  $scope.activateResultsTab = function (activeTab) {
    $scope.activeResultsTab = activeTab;
  };

  angular.element(document).ready(function () {
    $scope.$on('dateChange', function (event, data) {
      startDate = data.minDate;
      endDate = data.maxDate;
      _filterSearchResults();
      _updateAllResults();
    });
  });

  $scope.runQuery = function () {
    $stateParams.query = $scope.input.searchText;
    $scope.layers.overlays.foods.data = [];
    $scope.layers.overlays.drugs.data = [];
    $scope.layers.overlays.devices.data = [];

    setQueryState();
    $.when.apply($, [queryDrugs(), queryFoods(), queryDevices()]).done([_filterSearchResults]);
  };

  function setQueryState(){
    $scope.devicesQueryInProgress = true;
    $scope.drugsQueryInProgress = true;
    $scope.foodsQueryInProgress = true;
    $scope.results.drugs = [];
    $scope.results.foods = [];
    $scope.results.devices = [];
  }

  var generalQuery = function () {
    $stateParams.query = $scope.input.searchText;
    var deferred = $.Deferred();

    setQueryState();
    $http.get(config.resources.general + '?query=' + $scope.input.searchText)
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
  $.when(generalQuery()).done([_filterSearchResults, _updateAllResults]);

  function queryDrugs() {
    var deferred = $.Deferred();
    $http.get(config.resources.drugs + '?query=' + $scope.input.searchText)
      .success(function (resp) {
        if(!resp.error){
          $scope.results.drugs = resp;
        }
        handleDrugsResponse();
        deferred.resolve();
      })
      .error(function () {
        console.log("error requesting drugs");
        $scope.drugsQueryInProgress = false;
      });
    return deferred;
    // current: status: '' || []
    // ideal: status: '', drug: [], food: [], device: []
  }

  function queryFoods() {
    var deferred = $.Deferred();
    $http.get(config.resources.foods + '?query=' + $scope.input.searchText)
      .success(function (resp) {
        if(!resp.error){
          $scope.results.foods = resp;
        }
        handleFoodsResponse();
        deferred.resolve();
      })
      .error(function () {
        console.log("error requesting foods");
        $scope.foodsQueryInProgress = false;
      });
    return deferred;
  }

  function queryDevices() {
    var deferred = $.Deferred();
    $http.get(config.resources.devices + '?query=' + $scope.input.searchText)
      .success(function (resp) {
        if(!resp.error){
          $scope.results.devices = resp;
        }
        handleDevicesResponse();
        deferred.resolve();
      })
      .error(function () {
        console.log("error requesting devices");
        $scope.devicesQueryInProgress = false;
      });
    return deferred;
  }

  function handleFoodsResponse(){
    $scope.foodsQueryInProgress = false;

    // Plot food geodata points
    if (typeof $scope.results.foods !== 'undefined') {
      _addPointsToHeatmap($scope.results.foods, $scope.layers.overlays.foods.data);
      refreshMap();
    }
  }

  function handleDrugsResponse(){
    $scope.drugsQueryInProgress = false;

    // Plot drug geodata points
    if (typeof $scope.results.drugs !== 'undefined') {
      _addPointsToHeatmap($scope.results.drugs, $scope.layers.overlays.drugs.data);
      refreshMap();
    }
  }

  function handleDevicesResponse(){
    $scope.devicesQueryInProgress = false;

    // Plot device geodata points
    if (typeof $scope.results.devices !== 'undefined') {
      _addPointsToHeatmap($scope.results.devices, $scope.layers.overlays.devices.data);
      refreshMap();
    }
  }

  function _updateAllResults() {
    $scope.layers.overlays.foods.data = [];
    $scope.layers.overlays.drugs.data = [];
    $scope.layers.overlays.devices.data = [];

    handleDrugsResponse();
    handleFoodsResponse();
    handleDevicesResponse();

    refreshMap();
  }

  function refreshMap(){
    $scope.layers.overlays.foods.doRefresh = true;
    $scope.layers.overlays.drugs.doRefresh = true;
    $scope.layers.overlays.devices.doRefresh = true;
    // This is what people currently recommend to get the map to update immediately
    leafletData.getMap().then(function(map) {
      map.invalidateSize();
    });
  }

  function _addPointsToHeatmap(category, layer) {
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
            for (var j = 0; j < layer.length; j++) {
              if (latLng[0] === layer[j][0] &&
                latLng[1] === layer[j][1]) {
                latLng = _perturbPoints(latLng, perturbRadius);
                break;
              }
            }
            if (category[i].isDisplayable) {
              layer.push(latLng);
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

    if(dateToCheckYear === startDateYear){
      // Check month (assumes format of YYYYMMDD)
      var dateToCheckMonth = Number(dateToCheckString.substring(4,6));
      var startDateMonth = Number(startDate.getMonth().toString());
      if (dateToCheckMonth < startDateMonth) {
        return false;
      }

      if(dateToCheckMonth === startDateMonth) {
        // Check day (assumes format of YYYYMMDD)
        var dateToCheckDay = Number(dateToCheckString.substring(6,8));
        var startDateDay = Number(startDate.getDay().toString());
        if (dateToCheckDay < startDateDay) {
          return false;
        }
      }
    }
    if(dateToCheckYear === endDateYear) {
      var dateToCheckMonth = Number(dateToCheckString.substring(4,6));
      var endDateMonth = Number(endDate.getMonth().toString());
      if (dateToCheckMonth > endDateMonth) {
        return false;
      }

      if(dateToCheckMonth === startDateMonth) {
        var dateToCheckDay = Number(dateToCheckString.substring(6,8));
        var endDateDay = Number(endDate.getDay().toString());
        if (dateToCheckDay > endDateDay) {
          return false;
        }
      }
    }


    return true;
  }

}]);