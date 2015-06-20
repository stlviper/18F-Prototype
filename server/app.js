'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();





module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
  });

  var port = process.env.PORT || 80;
  app.listen(port);

  console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
});
