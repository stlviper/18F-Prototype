'use strict';

openfdaviz.directive('openfdavizSearchBar', function () {
  return {
    restrict: 'AE',
    replace: 'true',
    templateUrl: '/app/components/searchbar/controls/searchBar2.html',
    controller: 'SearchBarController'
  }
});