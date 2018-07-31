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
  req.on('end', function (req) {
    setTimeout(() => {
      const options = {
        'headers': [{
          'content-type': 'text/plain; charset=UTF-8',
          'name-file': 'ckt_list'
        }]

      }
      var fileName = 'ckt_list.txt';
      res.sendFile(__dirname + '/' + fileName, function (err) {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Sent:', fileName);
        }
      })
    },
      3000)
    // setTimeout(() => {
    //   var fileName2 = 'arrays.txt';
    //   res.sendFile(__dirname + '/' + fileName2, function (err) {
    //     if (err) {
    //       console.error(err.message);
    //     } else {
    //       console.log('Sent:', fileName2);
    //     }
    //   })
    // },
    //   5000)
  });
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});