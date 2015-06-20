'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();





module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');//req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  // install middleware
  swaggerExpress.register(app);
  
  var port = process.env.PORT || 80;
  app.listen(port);

  console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
});
