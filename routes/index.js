var express = require('express');
var router = express.Router();
//var socket = require('../config/socket');
//var io = socket.io;
var neo4jSession = require('../config/neo4j');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });

  let personName = 'Guybrush';
  let resultPromise = neo4jSession.run(
    'CREATE (a:Person {name: $name}) RETURN a',
    { name: personName }
  );
  
  resultPromise.then(result => {
    let singleRecord = result.records[0];
    let node = singleRecord.get(0);
  
    console.log(node.properties.name);
  });

});

module.exports = router;


/*
io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});
*/