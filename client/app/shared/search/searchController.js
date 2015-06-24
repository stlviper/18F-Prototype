'use strict';

openfdaviz.controller('SearchController', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams){
  $scope.activeTab = 'query';

  if($stateParams.searchQuery){
    console.log('test: '+$stateParams.searchQuery);
  }

  angular.element(document).ready(function () {
  });

  $scope.activateSearchTab = function(activeTab){
    $scope.activeTab = activeTab;
  }
}]);