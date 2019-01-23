var express = require('express');
var router = express.Router();
var socket = require('../config/socket');
var io = socket.io.of("/curriculumGraph");
var api = require('../api/api');

io.on('connection', function (socket) {
  console.log('a user connected');
  
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on("invoke", function(data){
    api.invoke(data).then(
      result=> {
        data.result = result;        
        socket.emit("invoke", data);
      },
      error => {console.log(error)}
    );
  });

});

module.exports = router;

