'use strict';
var http = require('http');
var test = require('tape');
var BinHandler = require('../../../lib/handlers/bin.js');

var models = {
  user: {
    setBinOwner: function (name, bin, callback) {
      callback(null); 
    }
  },
  bin: {
    create: function (params, callback) {
      callback(null, params); 
    } 
  }
};

var helpers = {
  set: function () {
    return null; 
  } 
};

var server;

test('BinHandler::setup', function (setup) {
  
  server = http.createServer(function (req, res) {
    res.end();
  });
  server.listen(1234, function () {
    setup.end(); 
  });

});

test('BinHandler', function (handler) {
 
  handler.plan(1);

  handler.test('\t#createBin', function (t) {
    t.plan(1);
    var instance = new BinHandler({
      models: models,
      helpers: helpers 
    });
    var req = new http.ClientRequest({
      port: 1234 
    });
    var res = new http.ServerResponse({
      port:1234 
    });
    req.session = {};
    req.body = {
      html: '<p> hello world </p>',
      css: 'body {\n\tmargin: 0;\n}',
      javascript: 'console.log(\'foo\');',
      settings: {}
    };
    instance.createBin(req, res, function (err) {
      if (err) {
        return t.err(err); 
      }
      req.end();
      res.end();
      t.pass('Called next with no error');
    }, function () {
      req.end();
      res.end();
      t.pass('created a bin!!');
    }); 
  });

});

test('BinHandler::teardown', function (teardown) {
  server.unref();
  teardown.end(); 
});
