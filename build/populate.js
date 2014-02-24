var async      = require('async'); // NOT "asyncjs" (used elsewhere)

var options    = require('../lib/config'),
    store      = require('../lib/store')(options.store),
    routes     = require('../lib/routes'),
    handlers   = require('../lib/handlers'),
    utils      = require('../lib/utils');

// DUMP
//
// ALTER TABLE owners ADD COLUMN html BOOLEAN NOT NULL DEFAULT 0, ADD COLUMN css BOOLEAN NOT NULL DEFAULT 0, ADD COLUMN javascript BOOLEAN NOT NULL DEFAULT 0;
//
// /DUMP

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
    if (!sandboxBin) return done();

    ownerBin.summary = utils.titleForBin(sandboxBin);
    ownerBin.html = !!sandboxBin.html;
    ownerBin.css = !!sandboxBin.css;
    ownerBin.javascript = !!sandboxBin.javascript;

    if (!ownerBin.last_updated || isNaN(ownerBin.last_updated.getTime())) { ownerBin.date = new Date(sandboxBin.created); }
    else { ownerBin.date = new Date(ownerBin.last_updated); }

//    ownerBin.date = new Date(sandboxBin.created);

    if (!ownerBin.summary) console.log('no summary for %d', ownerBin.id);

    store.populateOwners(ownerBin, done);
  });
};

// Start

var start = 0,
    completed = 0,
    blocksize = 150;

var populate = function () {
  store.getOwnersBlock(start, blocksize, function (err, owners) {
    if (err) return console.error('getAllOwners:', err);

    async.forEachSeries(owners, populateBin, function (err) {
      if (err) return console.error('async done:', err);

      completed += owners.length;

      if (owners.length < blocksize) {
        console.log('===== done %d', completed);
      } else {
        console.log('===== block %d', completed);
        start += blocksize;
        setTimeout(populate, 1000 * 0.5);
      }
    });
  });
};

populate();
