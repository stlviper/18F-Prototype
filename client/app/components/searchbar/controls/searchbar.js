'use strict';

openfdaviz.directive('openfdavizSearchBar', function () {
  return {
    restrict: 'AE',
    replace: 'true',
    templateUrl: '/app/components/searchbar/controls/searchBar.html',
    controller: 'SearchBarController'
  }
});