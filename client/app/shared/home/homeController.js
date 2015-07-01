'use strict';

var config = null;
openfdaviz.controller('HomeController', ['$scope', function($scope){
  $scope.imagePath = $scope.$root.imagePath;
  angular.element(document).ready(function () {
    $('#splash-page-background').css('background', 'url(' + $scope.imagePath + '/splash.jpg) no-repeat center center fixed');
  });
}]);

