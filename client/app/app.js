'use strict';

window.openfdaviz = angular.module('openfdaviz', ['ui.router']);


window.openfdaviz.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/app/shared/home/home.html'
    })
    .state('search', {
      url: '/search',
      templateUrl: '/app/shared/search/search.html'
    });

});
