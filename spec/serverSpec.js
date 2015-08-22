var request = require('request');
var mocha = require('mocha');
var chai = require('chai');
var assert = require('assert');
var expect = require('chai').expect;

var server = require('../app.js');//.server;

describe('API', function() {
  describe('Endpoints Exist', function() {
    
    it('should respond to GET requests for "/" with a 200 status code', function(done) {
      request('http://127.0.0.1:3000/', function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
  }
}