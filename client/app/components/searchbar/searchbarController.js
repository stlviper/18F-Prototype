'use strict';

openfdaviz.controller('SearchBarController', ['$scope', '$state', function ($scope, $state) {
  $scope.sendSearch = function ($event) {
    $event.stopPropagation();
    var $searchTermTxt = $('#fdaSearch');
    $state.go('search', { query: $searchTermTxt.val() });
  };

  $scope.handleKeypress = function($event){
    if($event.keyCode === 13){
      $scope.sendSearch($event);
    }
  }
}]);
