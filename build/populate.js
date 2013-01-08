var async      = require('async'); // NOT "asyncjs" (used elsewhere)

var options    = require('../lib/config'),
    store      = require('../lib/store')(options.store),
    routes     = require('../lib/routes'),
    handlers   = require('../lib/handlers'),
    utils      = require('../lib/utils');

// Get the full bin from an entry in the owners table

var getBin = function (ownerBin, cb) {
  // the 'id' used in the store.getBin is not acutually the id but the url. helpful.
  var data = {
    id: ownerBin.url,
    revision: ownerBin.revision
  };
  store.getBin(data, cb);
};

// Populate the summary field of the owner table

var populateBin = function (ownerBin, done) {
  console.log("%d", ownerBin.id);
  
  getBin(ownerBin, function (err, sandboxBin) {
    if (err) return done(err);

    ownerBin.summary = utils.titleForBin(sandboxBin);
    ownerBin.date = ownerBin.last_updated;
    store.touchOwnership(ownerBin, done);
  });
};

// Start

store.getAllOwners(function (err, results) {
  if (err) return console.error('getAllOwners:', err);

  async.forEach(results, populateBin, function (err) {
    if (err) return console.error('async done:', err);
  });
});