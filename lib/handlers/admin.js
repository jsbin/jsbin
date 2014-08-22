'use strict';
var mysql = require('../db/mysql');
var config = require('../config');
var store = new mysql(config.store.mysql);
var models = require('../models');

var admin = module.exports = {
  name: 'admin'
};

admin.renderAdmin = function renderAdmin (req, res) {
  var root = req.app.locals.url('', true, req.secure);
  var statik = req.app.locals.urlForStatic('', req.secure);

  res.render('admin/index', {
    host: req.app.get('url host'),
    token: req.session._csrf,
    title: 'Admin',
    layout: 'sub/layout.html',
    httproot: root.replace('https', 'http'),
    root: root,
    'static': statik,
    request: req,
  });
};

admin.flagBin = function flagBin (req, res) {
  var url = req.body.bin;
  var rev = req.body.rev;

  // check if the bin exist
  store.getLatestBin({id: url}, function (a, bin) {
    if (bin) {
      // if no rev, get latest
      if (rev === 'latest') {
        rev = bin.revision;
      }
      // update active flag
      models.bin.updateBinData({url: url, revision: rev}, {active: 'y'}, function (err) {
        if (err) {
          console.log(err.stack);
          res.send(400, err);
        }
        res.json(200, { all: 'ok'});
      });
    } else {
      res.json(400, { all: 'Bin not found'});
    }
  });
};

admin.flagUser = function flagUser (req, res) {
  var username = req.body.username;

  // check if the user exist
  store.getUser(username, function(a, user) {
    if (user) {
      // update flagged status
      req.app.store.updateOwnershipData([username], {flagged: true}, function (err) {
        if (err) {
          console.log(err.stack);
          res.send(400, err);
        }
        res.json(200, { all: 'ok'});
      });
    } else {
      res.json(400, { all: 'User not found'});
    }
  });


};
