'use strict';

window.openfdaviz = angular.module('openfdaviz', ['ui.router', 'leaflet-directive']);

window.openfdaviz.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('default', {
      url: '/',
      views: {
        'nav': {
          templateUrl: '/app/components/nav/homepage.html'
        },
        'content': {
          templateUrl: '/app/shared/home/home.html',
          controller: 'HomeController'
        },
        'footer': {
          templateUrl: '/app/components/footer/homepage.html'
        }
      }
    })
    .state('search', {
      url: '/search?query',
      views: {
        'nav': {
          templateUrl: '/app/components/nav/standard.html'
        },
        'content': {
          templateUrl: '/app/shared/search/search.html'
        },
        'footer': {
          templateUrl: '/app/components/footer/standard.html'
        }
      }
    });

}]);
