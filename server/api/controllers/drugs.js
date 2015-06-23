'use strict';
var request = require('request');

//'https://api.fda.gov/drug/event.json?search=receivedate:[20040101+TO+20150101]&count=patient.patientsex',
//'http://54.165.240.32/drug/label.json?search=effective_time:[20090601+TO+20140731]&limit=50',


module.exports = {
      rangecount: eventRangeCount,
      search: eventSearch
}

function eventRangeCount (req, res) {
  var fdaUrl = 'https://api.fda.gov/drug/event.json?search=receivedate:[' + req.swagger.params.start.value + '+TO+' + req.swagger.params.end.value + ']&count=' + req.swagger.params.field.value;
  getDataFromFdaApi(fdaUrl, function(data){
    res.json(data);
  });
}

function eventSearch(req, res) {

  var limit = req.swagger.params.limit.value || 100;
  var start = req.swagger.params.skip.value || 0;
  var fdaUrl = 'https://api.fda.gov/drug/event.json?search='+req.swagger.params.query.value+'&limit='+limit+'&skip='+start;

  getDataFromFdaApi(fdaUrl, function(data){
    res.json(data);
  });
}


function getDataFromFdaApi(fdaUrl, callback) {
  request.get(
    fdaUrl,
    {json: true},
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        callback(body.results);
      }
    }
  );
}
