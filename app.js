// This file is responsible for establishing connections with the node server. It also provides the routes
// for querying the database to insert and retrieve topic and vote data

// The project uses a node server with express and a Postgres database to store data
var express = require('express'),
serveStatic = require('serve-static'),
mongoose = require('mongoose'),
morgan = require('morgan'),
bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Listen for an environment port
var port = process.env.PORT || 3000;

//sets the root directory to public
app.use(express.static(__dirname + '/public'));
 

// Connection string for our database
var connectionString = process.env.DATABASE_URL || 'localhost:27017'
// 'mongodb://backlashUser:password@ds035563.mongolab.com:35563/heroku_qlsklv26';

mongoose.connect(connectionString);

var db = mongoose.connection;

//define schema for new mongo db
var voteItemSchema = mongoose.Schema({
    text: String,
    vote: String, 
    sessionID: String
});

var VoteItem = mongoose.model('VoteItem', voteItemSchema);


// Request returns an array with all submitted topics
app.get('/api/topics', function(req, res){

  VoteItem.find({sessionID: req.query.sessionID}, function(err, records) {
    if (err) return console.error(err);
    console.log('records##########: ',records)
    return res.json(records);    
  });

});


// Posts a submitted topic to the database with a default value of 0 in the vote column
// These rows with 0 in the vote value are only used to present topics, and not when 
// querying votes
app.post('/api/topics', function(req, res){

  var rows = []; // Array to hold values returned from database

  // Grab data from http request
  var data = {text: req.body.text, sessionID: req.body.sessionID, vote: '[]'};
  // console.log('################@$$@%%%%%%%%%%%%#@45', req.body.sessionID);
  var whatever = new VoteItem(data);

  whatever.save(function(err, w) {
    if (err) return console.error(err);
    //query db for all vote items
    VoteItem.find({sessionID: req.body.sessionID},function(err, records) {
      if (err) return console.error(err);
      console.log('records$$$$$$$$$$$$: ',records)
      return res.json(records);    
    });
  });

});

// Retrives all topics and votes from database, other than those with a vote value of 0. Votes
// with a value 0 are not user submitted but actually only used in displaying topics.
app.get('/api/votes', function(req, res){

  VoteItem.find({sessionID: req.query.sessionID},function(err, records) {
    if (err) return console.error(err);
    return res.json(records);    
  });

});

// Post votes to the database 'vote' column as integers ranging from 1 to 100
app.post('/api/votes', function(req, res){

  var rows = [];
  var data = [];

  var sessionID = req.body[0].sessionID;

  for (var i = 0; i < req.body.length; i++){
    data[i] = {text: req.body[i].text, vote: req.body[i].vote, sessionID: req.body[i].sessionID};
  }

  var updateRecord = function() {
    if(data.length > 0) {
      var datum = data.shift();
      VoteItem.findOne({text: datum.text, sessionID: datum.sessionID}, function(err,record) {
        if (err) return console.error(err);
        var votes = JSON.parse(record.vote);
        votes.push(datum.vote);
        record.vote = JSON.stringify(votes);
        record.save(function() {
          updateRecord();
        });
      })
    } else {
      VoteItem.find({sessionID: sessionID},function(err, records) {
        if (err) return console.error(err);
        return res.json(records);    
      });
    }
  };

  updateRecord();

  // VoteItem.collection.insert(data, onInsert);

  // function onInsert(err, docs) {
  //     if (err) {
  //       console.log('error');
  //     } else {
  //       VoteItem.find({sessionID: req.query.sessionID},function(err, records) {
  //         if (err) return console.error(err);
  //         return res.json(records);    
  //       });
  //     }
  // }


});

// Delete all rows from topics table to reset for a new sprint
app.post('/api/reset', function(req, res){

    VoteItem.collection.remove();

    // var query = client.query('DELETE from topics');
    res.end();
    
});

// Describes the port we're listening on. Go to 'localhost:3000' in browser to serve locally
// var server = app.listen(port);

var server = app.listen(port, function() {
  var host = server.address().address;
  console.log('Strwpll app listening at http://%s:%s -- %s', host, port);
});

