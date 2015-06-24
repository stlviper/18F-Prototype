'use strict';

openfdaviz.directive('openfdavizSearchBar', function () {
  return {
    restrict: 'AE',
    replace: 'true',
    template: '<div class="col-xs-12 col-sm-8 col-md-8 col-lg-8 search-lg">\
      <div class="form-group has-feedback">\
        <input type="text" class="form-control" name="name" id="fdaSearch" placeholder="Search, Food, Drug, or Devices" value="" autocomplete="off">\
        <ul class="typeahead dropdown-menu"></ul>\
        <button id="searchBarBtn" ng-click="sendSearch($event)" href="#/search" class="btn btn-lg btn-default">Submit</button>\
       </div>\
    </div>',
    controller: 'SearchBarController'
  }
});