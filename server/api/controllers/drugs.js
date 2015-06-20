var request = require('request');

function drugs(req, res) {
  request.get(
    'https://api.fda.gov/drug/event.json?search=receivedate:[20040101+TO+20150101]&count=receivedate',
    {form: {key: 'value'}},
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.json(JSON.parse(body));
      }
    }
  );
}