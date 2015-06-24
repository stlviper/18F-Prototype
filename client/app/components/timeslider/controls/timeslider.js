'use strict';
openfdaviz.directive("openfdavizTimeSlider", ['$parse', function ($parse) {
  var _settings = {
    minDate: 2014,
    maxDate: 2015
  };

  var _formatDateForQuery = function(date){
    var outputFormat = d3.time.format('%Y%m%d');
    return outputFormat(date);
  };

  var _formateDateForDisplay = function(date){
    var outputFormat = d3.time.format('%m/%d/%Y');
    return outputFormat(date)
  };

  var _updateDateFields = function ($minDateControl, minDate, $maxDateControl, maxDate) {
    $minDateControl.val(_formateDateForDisplay(minDate));
    $maxDateControl.val(_formateDateForDisplay(maxDate));
  };

  var _leapYear = function (year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  };

  var _convertDecimalDate = function (decimalDate) {
    var year = parseInt(decimalDate);
    var reminder = decimalDate - year;
    var daysPerYear = _leapYear(year) ? 366 : 365;
    var miliseconds = reminder * daysPerYear * 24 * 60 * 60 * 1000;
    var yearDate = new Date(year, 0, 1);
    return new Date(yearDate.getTime() + miliseconds);
  };


  return {
    restrict: 'AE',
    replace: true,
    template: '<div id="timesliderControl"></div>',
    link: function (scope, element, attrs) {
      var $minDateSltr = null, $maxDateSltr = null;
      if (attrs.minDateSltr && attrs.maxDateSltr) {
        $minDateSltr = $(attrs.minDateSltr);
        $maxDateSltr = $(attrs.maxDateSltr);
      }
      d3.select('#timesliderControl').call(d3.slider()
          .axis(true)
          .min(_settings.minDate)
          .max(_settings.maxDate)
          .value([_settings.minDate, _settings.maxDate])
          .on("slideend", function (evt, value) {
            var minDate = _convertDecimalDate(value[0]);
            var maxDate = _convertDecimalDate(value[1]);
            if ($minDateSltr && $maxDateSltr) {
              _updateDateFields($minDateSltr, minDate, $maxDateSltr, maxDate);
            }
          })
      );
    }
  };
}]);