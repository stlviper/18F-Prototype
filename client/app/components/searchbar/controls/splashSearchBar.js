'use strict';

openfdaviz.directive('openfdavizSplashSearchBar', function () {
  return {
    restrict: 'AE',
    replace: 'true',
    templateUrl: '/app/components/searchbar/controls/splashSearchBar.html',
    controller: 'SearchBarController'
  }
});