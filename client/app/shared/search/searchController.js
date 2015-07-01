'use strict';

openfdaviz.controller('SearchController', ['$scope', '$http', '$stateParams', "leafletData", function ($scope, $http, $stateParams, leafletData) {

  var Categories = {
    FOODS: 0, DRUGS: 1, DEVICES: 2
  };
  // Keep track of how many points are being displayed on the heatmap after filtering
  // for each category so the tabs of the results pane match
  $scope.counts = {
    foods: 0,
    drugs: 0,
    devices: 0
  };

  //Setting up the Leaflet Directive
  var mapZoom = 1;

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
        data: [],
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
        data: [],
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
        data: [],
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

  function init() {
    angular.element(document).ready(function () {
      bindEvents();
    });
  }

  function bindEvents() {
    $("#closeModalButton").on("click", function () {
      $("#detailModal").modal('hide');
    });
  }

  $scope.showModal = function (result) {
    $scope.modal.selectedItem = result;
    $('#detailModal').modal('show');
  };

  $scope.$on("$destroy", function () {
    $(document).off('show.bs.modal', '#detailModal');
  });

  $scope.activeResultsTab = 'foods';

  var startDate = new Date("December 31, 1970");
  var endDate = new Date();
  $scope.input = {
    searchText: $stateParams.query
  };
  $scope.query = $stateParams.query;
  $scope.devicesQueryInProgress = false;
  $scope.drugsQueryInProgress = false;
  $scope.foodsQueryInProgress = false;
  $scope.modal = {
    selectedItem: {}
  };

  var emptyResults = {
    drugs: [],
    devices: [],
    foods: []
  };

  $scope.results = emptyResults;

  $scope.handleKeypress = function ($event) {
    if ($event.keyCode === 13) {
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
      _updateAllResults();
    });
  });

  $scope.runQuery = function () {
    $stateParams.query = $scope.input.searchText = $('#searchText').val();
    $scope.layers.overlays.foods.data = [];
    $scope.layers.overlays.drugs.data = [];
    $scope.layers.overlays.devices.data = [];
    $scope.counts.foods = 0;
    $scope.counts.drugs = 0;
    $scope.counts.devices = 0;

    setQueryState();
    $.when.apply($, [queryDrugs(), queryFoods(), queryDevices()]).done([_updateAllResults]);
  };

  function setQueryState() {
    $scope.devicesQueryInProgress = true;
    $scope.drugsQueryInProgress = true;
    $scope.foodsQueryInProgress = true;
    $scope.results.drugs = [];
    $scope.results.foods = [];
    $scope.results.devices = [];
    $scope.counts.foods = 0;
    $scope.counts.drugs = 0;
    $scope.counts.devices = 0;
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
  $.when(generalQuery()).done([_updateAllResults]);

  function queryDrugs() {
    var deferred = $.Deferred();
    $http.get(config.resources.drugs + '?query=' + $scope.input.searchText)
      .success(function (resp) {
        if (!resp.error) {
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
        if (!resp.error) {
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
        if (!resp.error) {
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

  function handleFoodsResponse() {
    $scope.foodsQueryInProgress = false;

    // Plot food geodata points
    if ($scope.results.foods) {
      _addPointsToHeatmap(Categories.FOODS, $scope.results.foods, $scope.layers.overlays.foods.data);
      refreshMap();
    }
  }

  function handleDrugsResponse() {
    $scope.drugsQueryInProgress = false;

    // Plot drug geodata points
    if ($scope.results.drugs) {
      _addPointsToHeatmap(Categories.DRUGS, $scope.results.drugs, $scope.layers.overlays.drugs.data);
      refreshMap();
    }
  }

  function handleDevicesResponse() {
    $scope.devicesQueryInProgress = false;

    // Plot device geodata points
    if ($scope.results.devices) {
      _addPointsToHeatmap(Categories.DEVICES, $scope.results.devices, $scope.layers.overlays.devices.data);
      refreshMap();
    }
  }

  function _updateAllResults() {
    $scope.layers.overlays.foods.data = [];
    $scope.layers.overlays.drugs.data = [];
    $scope.layers.overlays.devices.data = [];
    $scope.counts.foods = 0;
    $scope.counts.drugs = 0;
    $scope.counts.devices = 0;

    if ($scope.results.foods) {
      _filterSearchResults($scope.results.foods);
    }
    if ($scope.results.drugs) {
      _filterSearchResults($scope.results.drugs);
    }
    if ($scope.results.devices) {
      _filterSearchResults($scope.results.devices);
    }

    handleDrugsResponse();
    handleFoodsResponse();
    handleDevicesResponse();

    refreshMap();
  }

  function refreshMap() {
    $scope.layers.overlays.foods.doRefresh = true;
    $scope.layers.overlays.drugs.doRefresh = true;
    $scope.layers.overlays.devices.doRefresh = true;
    // This is what people currently recommend to get the map to update immediately
    leafletData.getMap().then(function (map) {
      map.invalidateSize();
    });
  }

  function _addPointsToHeatmap(label, category, layerData) {
    var perturbRadius = 0.004;
    for (var i in category) {
      if (category[i].isDisplayable &&
          category[i].GeoLocation &&
          category[i].GeoLocation.lat &&
          category[i].GeoLocation.lng) {
        var lat = Number(category[i].GeoLocation.lat);
        var lng = Number(category[i].GeoLocation.lng);
        var latLng = [lat, lng];
        // Since the heatmap doesn't change when there are duplicate points,
        // perturb duplicate points a little so there is a visible difference
        // in the heatmap
        _perturbDuplicatePoints(layerData, latLng, perturbRadius);
        _incrementDisplayCount(label, category[i]);
        layerData.push(latLng);
      }
    }
  }

  function _incrementDisplayCount(label, categoryElement) {
    if (categoryElement.isDisplayable) {
      switch (label) {
        case Categories.FOODS:
          $scope.counts.foods += 1;
          break;
        case Categories.DRUGS:
          $scope.counts.drugs += 1;
          break;
        case Categories.DEVICES:
          $scope.counts.devices += 1;
          break;
        default:
          break;
      }
    }
  }

  function _perturbDuplicatePoints(layerData, latLng, radius) {
    for (var j = 0; j < layerData.length; j++) {
      if (latLng[0] === layerData[j][0] &&
        latLng[1] === layerData[j][1]) {
        latLng = _perturbPointPair(latLng, radius);
        break;
      }
    }
  }

  function _perturbPointPair(latLng, radius) {
    // Spread duplicate points in a small circle around the point
    var angle = 2 * Math.PI * Math.random();
    latLng[0] += radius * Math.sin(angle);
    latLng[1] += radius * Math.cos(angle);
    return latLng;
  }

  var _filterSearchResults = function (category) {
    for (var i in category) {
      if (!category[i].isDisplayable) {
        category[i].isDisplayable = true;
      }
      if (category[i].report_date) {
        if (!_isDateInBounds(category[i].report_date)) {
          category[i].isDisplayable = false;
        } else {
          category[i].isDisplayable = true;
        }
      }
    }
  };

  function _isDateInBounds(dateToCheckString) {
    // Check year
    var reYear = /((19|20)\d{2})/;
    var dateToCheckYear = Number(dateToCheckString.match(reYear)[0]);
    var startDateYear = Number(startDate.getFullYear().toString());
    var endDateYear = Number(endDate.getFullYear().toString());
    var dateToCheckMonth = Number(dateToCheckString.substring(4, 6));
    var startDateMonth = Number(startDate.getMonth().toString());
    var endDateMonth = Number(endDate.getMonth().toString());
    var dateToCheckDay = Number(dateToCheckString.substring(6, 8));
    var startDateDay = Number(startDate.getDay().toString());
    var endDateDay = Number(endDate.getDay().toString());

    if ((dateToCheckYear < startDateYear) || (dateToCheckYear > endDateYear)) {
      return false;
    }
    else if (dateToCheckYear === startDateYear) {
      // Check month (assumes format of YYYYMMDD)
      if (dateToCheckMonth < startDateMonth) {
        return false;
      } else if (dateToCheckMonth === startDateMonth) {
        // Check day (assumes format of YYYYMMDD)
        if (dateToCheckDay < startDateDay) {
          return false;
        }
      }
    }
    else if (dateToCheckYear === endDateYear) {
      if (dateToCheckMonth > endDateMonth) {
        return false;
      } else if (dateToCheckMonth === startDateMonth) {
        if (dateToCheckDay > endDateDay) {
          return false;
        }
      }
    }
    else {
      return true;
    }
  }

  init();

}]);