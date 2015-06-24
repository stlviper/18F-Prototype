'use strict';

openfdaviz.controller('SearchBarController', ['$scope', '$location', function($scope, $location){

  $scope.sendSearch = function($event){
    $event.stopPropagation();
    var $searchTermTxt = $('#fdaSearch');
    console.log('Value:'+$searchTermTxt.val());
  };

}]);
