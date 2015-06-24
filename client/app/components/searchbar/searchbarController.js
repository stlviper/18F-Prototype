'use strict';

openfdaviz.controller('SearchBarController', ['$scope', '$location', function($scope, $location){

  $scope.sendSearch = function($event){
    $event.stopPropagation();
    console.log('test');
  };

}]);
