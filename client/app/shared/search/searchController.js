'use strict';

openfdaviz.controller('SearchController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
  var _settings = {
    generalApiCall: ''
  };
  $scope.activeTab = 'query';
  $scope.results = {
    drugs: [{message: 'test'}, {message: 'test two'}],
    devices: [{message: 'test three'}, {message: 'test four'}],
    foods: [{message: 'test five'}, {message: 'test six'}]
  };

  if ($stateParams.searchQuery) {
    console.log('test: ' + $stateParams.searchQuery);
  }

  angular.element(document).ready(function () {
  });

  $scope.activateSearchTab = function (activeTab) {
    $scope.activeTab = activeTab;
  }
}]);