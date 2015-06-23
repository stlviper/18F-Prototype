'use strict';

window.openfdaviz = angular.module('openfdaviz', ['ui.router']);


window.openfdaviz.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');

  $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
    .state('home', {
      url: '/',
      templateUrl: '/app/partial-homepage.html'
    })
    .state('timeline', {
      url: '/timeline',
      templateUrl: '/app/components/timeline/timelineView.html'
    })
    .state('map', {
      url: '/map',
      templateUrl: '/app/components/map/mapView.html'
    });

});
