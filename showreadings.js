var serialport = require("serialport");
var sys = require('sys');
var fs = require('fs');

var app = require('express').createServer()
  , io = require('socket.io').listen(app);
var express = require('express');



function connect_sensor(callback){
  console.log("connecting to sensor...");

  function connect(cb){
    console.log("waiting.");
    var found = false;
    // serialport.list(function (err, ports) {
    //   ports.forEach(function(port) {
    //     if(found) return;

    //     console.log(port);
    //     // console.log(port.comName);
    //     // console.log(port.pnpId);
    //     // console.log(port.manufacturer);

    //     // if(port.manufacturer.indexOf("rduino") > -1){
    //     //   found = true;
    //     //   cb(port.comName);
    //     // }
    //   });

    //   if(!found) {
    //     setTimeout(function(){ connect(cb); }, 1000);  recurse
    //   }
    // });

    fs.readdir('/dev', function(err, files){
      files.forEach(function(port){
        if(found) return;

        if(port.indexOf("usbmodem") > -1){
          found = true;
          cb('/dev/'+port);
        }
      });

      if(!found) {
        setTimeout(function(){ connect(cb); }, 1000);  // recurse
      }
    });
  };

  connect(function(commPort){
    console.log("sensor connected on:", commPort);

    var sp = new serialport.SerialPort(commPort, {
      baudrate: 9600,
      parser: serialport.parsers.readline("\n")
    });

    sp.on("close", function (data) {
      console.log("SERIAL PORT CLOSED!");
      sp = null;
      connect_sensor(callback);
    });

    callback(sp);
  });
};

app.use(express.static(__dirname + '/public'));

io.set('log level', 1);
io.sockets.on('connection', function (socket) {
  connect_sensor(function(sp){
    sp.on("data", function (data) {
      socket.emit('reading', {reading: data});
    });
  });
});

app.listen(8080);
