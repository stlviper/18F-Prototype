'use strict';
openfdaviz.directive("openfdavizTimeSlider", ['$parse', function ($parse) {
  var _settings = {
    minYear: 2014,
    maxYear: 2015,
    $minDateSltr: '',
    $maxDateSltr: ''
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

  var _sliderControl = function () {
    //NOTE(JNHager): In order to update the slider must destroy and rebuild if the dates change.
    // This is a know bug in for d3.slider. Could use JQuery slider but would take a bit more
    // work to get labels. Open for suggestions.
    var dateSlider = d3.slider()
      .axis(true)
      .min(_settings.minYear)
      .max(_settings.maxYear)
      .value([_settings.minDefaultValue, _settings.maxDefaultValue])
      .on("slideend", function (evt, value) {
        var minDate = _convertDecimalDate(value[0]);
        var maxDate = _convertDecimalDate(value[1]);
        if (_settings.$minDateSltr && _settings.$maxDateSltr) {
          _updateDateFields(_settings.$minDateSltr, minDate, _settings.$maxDateSltr, maxDate);
        }
      });
    d3.select('#timesliderControl').html("");
    d3.select('#timesliderControl').call(dateSlider);
  };

  return {
    restrict: 'AE',
    replace: true,
    template: '<div id="timesliderControl"></div>',
    link: function (scope, element, attrs) {
      if (attrs.minDate && attrs.maxDate) {
        var maxDefaultDate = (new Date(attrs.maxDate));
        maxDefaultDate = new Date(maxDefaultDate.getTime() + maxDefaultDate.getTimezoneOffset() * 60 * 1000);
        var minDefaultDate = (new Date(attrs.minDate));
        minDefaultDate = new Date(minDefaultDate.getTime() + maxDefaultDate.getTimezoneOffset() * 60 * 1000);

        _settings.maxYear = maxDefaultDate.getFullYear() + .01;
        _settings.minYear = minDefaultDate.getFullYear() - .01;
        _settings.minDefaultValue = _convertDateToDecimal(minDefaultDate);
        _settings.maxDefaultValue = _convertDateToDecimal(maxDefaultDate);
      }
      if (attrs.minDateSltr && attrs.maxDateSltr) {
        _settings.$minDateSltr = $(attrs.minDateSltr);
        _settings.$maxDateSltr = $(attrs.maxDateSltr);

        var dateChange = function () {
          var maxValue = _convertDateToDecimal(new Date(_settings.$maxDateSltr.val()));
          var minValue = _convertDateToDecimal(new Date(_settings.$minDateSltr.val()));

          _settings.minDefaultValue = minValue > _settings.minYear ? minValue : _settings.minYear;

          _settings.maxDefaultValue = maxValue < _settings.maxYear ? maxValue : _settings.maxYear;

          _sliderControl();

        };
        _settings.$minDateSltr.change(dateChange);
        _settings.$maxDateSltr.change(dateChange);

        _settings.$minDateSltr.datepicker({altField: '#start-date-icon'});
        _settings.$maxDateSltr.datepicker();

        _updateDateFields(_settings.$minDateSltr, new Date(attrs.minDate),
          _settings.$maxDateSltr, new Date(attrs.maxDate));
      }

      _sliderControl();
    }
  };
}]);