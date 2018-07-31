const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
var request = require('request');

var app = express();
app.set('port', process.env.PORT || 3000);
app.post('/:filename', function (req, res) {
  var filename = path.basename(req.params.filename);
  filename = path.resolve(__dirname, filename);
  var dst = fs.createWriteStream(filename);
  console.log('Received input!');
  req.pipe(dst);

  dst.on('drain', function () {
    console.log('drain', new Date());
    req.resume();
  });
  req.on('end', function () {
    // to do
    setTimeout(() => {
      // File ckt_list.txt
      var target = 'http://localhost:3001/ckt_list.txt';
      var rs = fs.createReadStream('ckt_list.txt');
      var ws = request.post(target);
      // File arrays
      var target2 = 'http://localhost:3001/arrays.txt';
      var rs = fs.createReadStream('arrays.txt');
      var ws = request.post(target2);

      ws.on('drain', function () {
        console.log('drain', new Date());
        rs.resume();
      });

      rs.on('end', function () {
        console.log('uploaded to client success ');
      });

      ws.on('error', function (err) {
        console.error('cannot send file to ' + target + ': ' + err);
      });

      rs.pipe(ws);
      res.sendStatus(200);
    },
      3000)
  });
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});