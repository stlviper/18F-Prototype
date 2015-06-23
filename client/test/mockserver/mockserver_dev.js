var express = require('express');
var app = express();
var path = require('path');

//serve dev-build index
app.use(express.static(path.join(__dirname, '../../')));

var port = process.env.PORT || 8000;
app.listen(port);

console.log('Listening on port ' + port);