'use strict';

var config = null;
openfdaviz.controller('LayoutController', ['$scope', '$http', function($scope, $http){
  $scope.imagePath = null;

  function init(){
    $.ajax({
      url: 'config.json',
      async: false,
      success: function(resp){
        config = resp;
        $scope.imagePath = config.paths.images;
      }
    })
  }
  //angular.element(document).ready(function () {
  //  if(!config){
  //    $http.get('config.json').success(function(resp){
  //
  //    });
  //  }
  //});

  init();
}]);

