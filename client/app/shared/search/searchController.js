'use strict';

openfdaviz.controller('SearchController', ['$scope', '$http', function($scope, $http){
  $scope.activeTab = 'query';

  angular.element(document).ready(function () {
  });

  $scope.activateSearchTab = function(activeTab){
    $scope.activeTab = activeTab;
  }
}]);