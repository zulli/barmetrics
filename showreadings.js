var serialport = require("serialport");
var sys = require('sys');

var app = require('express').createServer()
  , io = require('socket.io').listen(app);
var express = require('express');

var sp = new serialport.SerialPort("/dev/tty.usbmodemfd131", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
  sp.on("data", function (data) {
    socket.emit('reading', {reading: data});
  });
});

app.listen(8080);
