'use strict';

var config = null;
openfdaviz.controller('LayoutController', ['$scope', '$http', function($scope, $http){
  $scope.imagePath = '';
  angular.element(document).ready(function () {
    if(!config){
      $http.get('config.json').success(function(resp){
        config = resp;
        setImagePath();
      });
    }
    else{
      setImagePath();
    }
  });

  function setImagePath(){
    $scope.imagePath = config.paths.images;
    $('#splash-page-background ').css('background', 'url(' + $scope.imagePath + 'splash.jpg) no-repeat center center fixed')
  }
}]);

