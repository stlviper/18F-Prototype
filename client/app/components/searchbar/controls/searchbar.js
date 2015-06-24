'use strict';

openfdaviz.directive('openfdavizSearchBar', function () {
  return {
    restrict: 'AE',
    replace: 'true',
    template: '<div class="col-xs-12 col-sm-8 col-md-8 col-lg-8 search-lg">\
  <div class="form-group has-feedback">\
    <input type="text" class="form-control" name="name" id="fdaSearch" placeholder="Find a community…" value="" autocomplete="off"><ul class="typeahead dropdown-menu"></ul>\
    <button class="form-control-feedback" style="border:none;background:none;pointer-events:visible;" type="submit"><img src="/images/mag-glass.png" alt="Search"></button>\
    </div>\
    </div>'
  }
});