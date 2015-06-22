'use strict';
var request = require('request');

module.exports = {
  fetch: fetch
}


function fetch(req, res) {
  request.get(
    //'https://api.fda.gov/drug/event.json?search=receivedate:[20040101+TO+20150101]&count=patient.patientsex',
    'https://api.fda.gov/drug/event.json?search=receivedate:['+req.swagger.params.start.value+'+TO+'+req.swagger.params.end.value+']&count='+req.swagger.params.field.value,
    //'http://54.165.240.32/drug/label.json?search=effective_time:[20090601+TO+20140731]&limit=50',
    {json: true},
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.json(body.results);
      }
    }
  );
}