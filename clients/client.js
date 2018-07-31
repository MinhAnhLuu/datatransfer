const request = require('request');
const fs = require('fs');

const path = require('path');
const express = require('express');
const http = require('http');
// var app = express();

// app.set('port', process.env.PORT || 3001);

// http.createServer(app).listen(app.get('port'), function () {
//   console.log('Express server listening on port ' + app.get('port'));
// });

// File .txt
var target = 'http://localhost:3000/input.txt' ;//+ path.String(basename(filename));
var rs = fs.createReadStream('input.txt');
var ws = request.post(target);
// File .snp
var target2 = 'http://localhost:3000/client.snp' ;
var rs = fs.createReadStream('client.snp');
var ws = request.post(target2);

ws.on('drain', function () {
  console.log('drain', new Date());
  rs.resume();
});

rs.on('end', function () {
  console.log('uploaded to server success');
});

ws.on('error', function (err) {
  console.error('cannot send file to ' + target + ': ' + err);
});

rs.pipe(ws);

var app = express();
app.set('port', process.env.PORT || 3001);
app.post('/:filename', function (req, res) {
  var filename = path.basename(req.params.filename);
  filename = path.resolve(__dirname, filename);
  var dst = fs.createWriteStream(filename);
  req.pipe(dst);

  dst.on('drain', function() {
    console.log('drain', new Date());
    req.resume();
  });
  req.on('end', function () {
    res.sendStatus(200);
  });
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});