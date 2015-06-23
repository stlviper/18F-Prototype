var express = require('express');
var app = express();
var path = require('path');

//serve prod-build index
app.use(express.static(path.join(__dirname, '../../../dist/client')));

var port = process.env.PORT || 8001;
app.listen(port);

console.log('Listening on port ' + port);