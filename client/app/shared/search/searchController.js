'use strict';

openfdaviz.controller('SearchController', ['$scope', '$http', function($scope, $http){
  $scope.activeTab = 'query';

  angular.element(document).ready(function () {
    console.log('These are not the droids you are looking for.')
  });

  $scope.activateSearchTab = function(activeTab){
    $scope.activeTab = activeTab;
  }
}]);