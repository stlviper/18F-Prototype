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


openfdaviz.directive("pieChart", ['$parse', function ($parse) {
  return {
    restrict: 'AE',
    replace: true,
    template: '<div><h2>Patient Gender</h2><div id="pieChart"></div><div id="dateSlider"></div></div>',
    link: function (scope, element, attrs) {
      var _settings = {
        apiUrl: 'http://f-eighteen-dev.elasticbeanstalk.com/drug/event/rangecount',
        minDate: 2004,
        maxDate: 2015,
        patientSexTerm: 'patient.patientsex',
        recieveDateTerm: 'receivedate',
        pieChart: null
      };

      var loadPieData = function (startDate, endDate) {
        var url = _settings.apiUrl + '?start=' + startDate + '&end=' + endDate + '&field=' + _settings.patientSexTerm;
        $.get(url)
          .done(function (data) {
            var columns = [];
            for (var idx in data) {
              columns.push([gender[data[idx].term], data[idx].count])
            }
            _settings.pieChart = c3.generate({
              bindto: '#pieChart',
              data: {
                columns: columns,
                type: 'pie'
              }
            });
          })
          .fail(function (data) {
            console.log(data);
          });
      };

      var updatePieData = function (startDate, endDate) {
        var url = _settings.apiUrl + '?start=' + startDate + '&end=' + endDate + '&field=' + _settings.patientSexTerm;
        $.get(url)
          .done(function (data) {
            if (_settings.pieChart) {
              var columns = [];
              for (var idx in data) {
                columns.push([gender[data[idx].term], data[idx].count])
              }
              _settings.pieChart.load({
                columns: columns
              });
            }
          })
          .fail(function (data) {
            console.log(data);
          });
      };

      loadPieData('20040101', '20150101');
      d3.select('#dateSlider').call(d3.slider()
          .axis(true)
          .min(_settings.minDate)
          .max(_settings.maxDate)
          .value([_settings.minDate, _settings.maxDate])
          .on("slideend", function (evt, value) {
            var minDate = convertDecimalDate(value[0]);
            var maxDate = convertDecimalDate(value[1]);
            updatePieData(minDate, maxDate);
          })
      );

    }
  };
}]);