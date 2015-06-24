'use strict';

var leapYear = function (year) {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
};

var convertDecimalDate = function (decimalDate) {
  var year = parseInt(decimalDate);
  var reminder = decimalDate - year;
  var daysPerYear = leapYear(year) ? 366 : 365;
  var miliseconds = reminder * daysPerYear * 24 * 60 * 60 * 1000;
  var yearDate = new Date(year, 0, 1);
  yearDate = new Date(yearDate.getTime() + miliseconds);
  var outputFormat = d3.time.format('%Y%m%d');
  return outputFormat(yearDate);
};

var gender = {'0': 'Unknown', '1': 'Male', '2': 'Female'};


openfdaviz.directive("timeslider", ['$parse', function ($parse) {
  return {
    restrict: 'AE',
    replace: true,
    template: '<div id="timesliderControl"></div>',
    link: function (scope, element, attrs) {
      d3.select('#timesliderControl').call(d3.slider()
          .axis(true)
          .min(_settings.minDate)
          .max(_settings.maxDate)
          .value([_settings.minDate, _settings.maxDate])
          .on("slideend", function (evt, value) {
            var minDate = convertDecimalDate(value[0]);
            var maxDate = convertDecimalDate(value[1]);
          })
      );
    }
  };
}]);