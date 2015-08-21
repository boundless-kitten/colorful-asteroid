var app = angular.module('Reflectiv', ['ngRoute'])
      .service('Sprint', function() {
        return {}; // object to store persistant info
      })
      .config(['$routeProvider', function($routeProvider) {
        $routeProvider
          .when('/', {
            templateUrl: 'start.html' // serves start view
          })
          .when('/topic/:id', {
            templateUrl: 'topic.html' // serves topic view
          })
          .when('/topic/:id/vote', {
            templateUrl: 'vote.html' // serves vote view
          })
          .when('/topic/:id/results', {
            templateUrl: 'results.html' // serves results view
          });
      }])
      .controller('TopicsController', function($location, $http, Sprint) { // injects location, http, sprint
        var topicsList = this; // sets scope to topicsList

        topicsList.init = function() {
          if (Sprint.table === undefined) {
            Sprint.table = $location.path().substring(7);
          }
        };

        topicsList.init();
        // Retrieve the list of already submitted votes when the topics page is accessed

        topicsList.topics = $http({
          url: '/api/topics', 
          method: "GET",
          params: {sessionID: Sprint.table}
        })
          .then(function(response) { // success function
            topicsList.topics = response.data; // stores topics in topicsList
          },
                function(response) { // error function
                  console.log('you have an error');
                });

        topicsList.create = function() {
          Sprint.table = Math.random().toString(36).substring(7); // generates sprint id
          $location.path('/topic/' + Sprint.table); // sets url to sprint id
        };

        topicsList.addTopic = function() {
          console.log('add the topic: ', topicsList.topicText);
          $http.post('/api/topics', {
            text: topicsList.topicText,
            sessionID: Sprint.table
          }) // adds topic to database
            .then(function(response) { // success function
              console.log('added the topic: ', topicsList.topicText);
              topicsList.topics = response.data; // updates topics
            },
                  function(response) { // error function
                    console.log('you have an error in your post request');
                  });

          topicsList.topicText = ''; // clears input field
        };

        topicsList.sprintUrl = 'http://reflectiv.guru/topic/' + Sprint.table + '/'; // sets sharable url

        topicsList.startVote = function() {
          $location.path('/topic/' + Sprint.table + '/vote'); // navigates to vote view
        };
      })

      .controller('VotesController', function($location, $http, Sprint) { // injects location, http, sprint
        var votesList = this; // sets scope to votesLIst

        votesList.init = function() {
          if (Sprint.table === undefined) {
            Sprint.table = $location.path().slice(7, 18);
          }
        };

        votesList.init();

        votesList.topics = $http({
          url: '/api/topics', 
          method: "GET",
          params: {sessionID: Sprint.table}
        }) // gets topics to vote one
          .then(function(response) { // success function
            votesList.topics = response.data; // sets votesList variable
          },
                function(response) { // error function
                  console.log('you have an error');
                });

        votesList.vote = function() {
          $http.post('/api/votes', votesList.topics) // post vote to db
            .then(function(response) { // success function
              console.log('Vote submitted');
            },
                  function(response) { // error function
                    console.log('you have an error in your voting');
                  });
        };

        votesList.viewResults = function() {
          $location.path('/topic/' + Sprint.table + '/results'); // navigates to results view
        };
      })

      .controller('ResultsController', function($location, $http, Sprint) { // injects location, http
        var resultsList = this; // sets scope to resultsList
        resultsList.obj = {}; // initializes object that stores results

        resultsList.init = function() {
          if (Sprint.table === undefined) {
            Sprint.table = $location.path().slice(7, 18);
          }
        };

        resultsList.init();


        // Retrieve the list of already submitted votes when the topics page is accessed
        resultsList.results = $http({
          url: '/api/topics', 
          method: "GET",
          params: {sessionID: Sprint.table}
        })
          .then(function(response) { // success function
            resultsList.results = response.data; // store results in resultsList.results
            console.log(response.data);
            for (var i = 0; i < resultsList.results.length; i++) { // iterate over results to compile votes
  
                resultsList.obj[resultsList.results[i].text] = JSON.parse(resultsList.results[i].vote); // push new vote onto votes array
             
            }
            // for (var arr in resultsList.obj) { // iterate over object storing vote arrays
            //   var sum = resultsList.obj[arr].reduce(function(a, b) {
            //     return a + b;
            //   }); // reduce arrays to get average
            //   resultsList.obj[arr] = (sum / resultsList.obj[arr].length).toFixed(1);
            // }
          },
                function(response) { // error function
                  console.log('you have an error');
                });

        resultsList.restart = function() {

          // Http request to url that will delete all rows in database for a new sprint
          $http.post('/api/reset', {})
            .then(function(response) { // success function
              console.log('Reset for new sprint');
            },
                  function(response) { // error function
                    console.log('you have an error in your voting');
                  });

          $location.path('/'); // restart


        };
      });
