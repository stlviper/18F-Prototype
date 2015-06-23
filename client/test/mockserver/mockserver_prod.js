var express = require('express');
var app = express();
var path = require('path');

//serve prod-build index
app.use(express.static(path.join(__dirname, '../../../dist/client')));

app.listen(8000);
console.log('Listening on port 8000');