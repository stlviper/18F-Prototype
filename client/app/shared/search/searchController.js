'use strict';

openfdaviz.controller('SearchController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
  $scope.activeTab = 'query';

  var minYear = '';
  var maxYear = '';
  var query = $stateParams.searchQuery;

  $scope.results = {
    drugs: [{message: 'test'}, {message: 'test two'}],
    devices: [{message: 'test three'}, {message: 'test four'}],
    foods: [{message: 'test five'}, {message: 'test six'}]
  };

  $scope.activateSearchTab = function (activeTab) {
    $scope.activeTab = activeTab;
  };

  angular.element(document).ready(function () {
    $scope.$on('dateChange', function(event, data){
      minYear = data.minYear;
      maxYear = data.maxYear;
    });
  });

  $scope.performQuery = function(){
    $.when.apply($, [queryDrugs(), queryFoods(), queryDevices()]).done(updateHeatmap);
  };

  function queryDrugs(){
    var deferred = $.Deferred();
    $http.get(config.resources.drugs + '?query=' + query)
      .success(function(resp){
        //update scope.results.drugs object
        console.log("drugs response: " + resp);
        deferred.resolve();
      })
      .error(function(){
        console.log("error requesting drugs");
      });
    return deferred;
  }

  function queryFoods(){
    var deferred = $.Deferred();
    $http.get(config.resources.foods + '?query=' + query)
      .success(function(resp){
        //update scope.results.foods object
        console.log("foods response: " + resp);
        deferred.resolve();
      })
      .error(function(){
        console.log("error requesting foods");
      });
    return deferred;
  }

  function queryDevices(){
    var deferred = $.Deferred();
    $http.get(config.resources.devices + '?query=' + query)
      .success(function(resp){
        //update scope.results.devices object
        console.log("devices response: " + resp);
        deferred.resolve();
      })
      .error(function(){
        console.log("error requesting devices");
      });
    return deferred;
  }

  function updateHeatmap(){

  }
}]);