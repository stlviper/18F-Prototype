'use strict';

openfdaviz.controller('LayoutController', ['$scope', '$http', function($scope, $http){
  $scope.imagePath = '';
  angular.element(document).ready(function () {
    $http.get('/config.json').success(function(resp){
      $scope.imagePath = resp.paths.images;
      $('.site-wrapper').css('background', 'url(' + $scope.imagePath + 'splash.jpg) no-repeat center center fixed')
    });
  });
}]);

