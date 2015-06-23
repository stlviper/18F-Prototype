var express = require('express');
var app = express();
var path = require('path');

//serve dev-build index
app.use(express.static(path.join(__dirname, '../../')));

app.listen(8000);
console.log('Listening on port 8000');