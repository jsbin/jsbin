'use strict';
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
    cacheBust: req.app.get('is_production') ? '?' + req.app.get('version') : ''
  });
};

admin.flagBin = function flagBin (req, res) {
  var url = req.body.bin;
  var rev = req.body.rev;

  // check if the bin exist

  // get latest if no rev given

  models.bin.updateBinData({url: url, revision: rev}, {active: 'y'},  function(err) {
    if (err) {
      console.log(err.stack);
      res.send(400, err);
    }
    res.json(200, { all: 'ok'});
  });
};

admin.flagUser = function flagUser (req, res) {
  var user = req.body.username;

  // check if the user exist

  req.app.store.updateOwnershipData([user], {flagged: true},  function(err) {
    if (err) {
      console.log(err.stack);
      res.send(400, err);
    }
    res.json(200, { all: 'ok'});
  });
};
