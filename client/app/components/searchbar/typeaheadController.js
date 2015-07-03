'use strict';

openfdaviz.controller('TypeaheadController', ['$scope', function($scope) {
  $scope.selected = undefined;
  $scope.terms = ['Pump', 'Peanuts', 'Lipitor', 'Advil'];
}]);