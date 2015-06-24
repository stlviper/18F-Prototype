'use strict';
openfdaviz.directive("openfdavizTimeSlider", ['$parse', function ($parse) {
  var _settings = {
    minYear: 2014,
    maxYear: 2015
  };

  var _formatDateForQuery = function (date) {
    var outputFormat = d3.time.format('%Y%m%d');
    return outputFormat(date);
  };

  var _formatDateForDisplay = function (date) {
    var outputFormat = d3.time.format('%m/%d/%Y');
    return outputFormat(date)
  };

  var _updateDateFields = function ($minDateControl, minDate, $maxDateControl, maxDate) {
    $minDateControl.val(_formatDateForDisplay(minDate));
    $maxDateControl.val(_formatDateForDisplay(maxDate));
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

  var _convertDateToDecimal = function (date) {
    var DecimalDate = parseFloat(date.getFullYear());
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    var daysPerYear = _leapYear(DecimalDate) ? 366 : 365;
    DecimalDate += (day / daysPerYear);
    return DecimalDate;
  };

  return {
    restrict: 'AE',
    replace: true,
    template: '<div id="timesliderControl"></div>',
    link: function (scope, element, attrs) {
      if (attrs.minDate && attrs.maxDate) {
        var maxDefaultDate = (new Date(attrs.maxDate));
        maxDefaultDate = new Date(maxDefaultDate.getTime() + maxDefaultDate.getTimezoneOffset() *60*1000);
        var minDefaultDate = (new Date(attrs.minDate));
        minDefaultDate = new Date(minDefaultDate.getTime() + maxDefaultDate.getTimezoneOffset() *60*1000);

        _settings.maxYear = maxDefaultDate.getFullYear()+.01;
        _settings.minYear = minDefaultDate.getFullYear()-.01;
        _settings.minDefaultValue = _convertDateToDecimal(minDefaultDate);
        _settings.maxDefaultValue = _convertDateToDecimal(maxDefaultDate);
      }
      var $minDateSltr = null, $maxDateSltr = null;
      if (attrs.minDateSltr && attrs.maxDateSltr) {
        $minDateSltr = $(attrs.minDateSltr);
        $maxDateSltr = $(attrs.maxDateSltr);

        _updateDateFields($minDateSltr, new Date(attrs.minDate),
          $maxDateSltr, new Date(attrs.maxDate));
      }

      console.log(_convertDecimalDate(_convertDateToDecimal(new Date('2014-01-01'))));

      var dateSlider = d3.select('#timesliderControl').call(d3.slider()
          .axis(true)
          .min(_settings.minYear)
          .max(_settings.maxYear)
          .value([_settings.minDefaultValue, _settings.maxDefaultValue])
          .on("slideend", function (evt, value) {
            var minDate = _convertDecimalDate(value[0]);
            var maxDate = _convertDecimalDate(value[1]);
            if ($minDateSltr && $maxDateSltr) {
              _updateDateFields($minDateSltr, minDate, $maxDateSltr, maxDate);
            }
          }));
      dateSlider.value([2006,2009]);
    }
  };
}]);