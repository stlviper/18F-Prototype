'use strict';

var config = null;
openfdaviz.controller('LayoutController', ['$scope', function($scope){
  $scope.imagePath = null;

  function init(){
    $.ajax({
      url: 'config.json',
      async: false,
      success: function(resp){
        config = resp;
        $scope.imagePath = config.paths.images;
      }
    });
  }

  init();
}]);

