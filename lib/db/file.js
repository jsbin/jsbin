var fdb = require('file-db'),
    utils = require('../utils'),
    _ = require('underscore');

module.exports = utils.inherit(Object, {
  defaults: null,

  constructor: function FileDB(options) {
    this.options    = options;
    if (!this.options.location) throw new Error("No database location set.");
    this.connection = null;
  },

  connect: function (cb) {
    // Open up a database in a temporary directory and save the connection
    fdb.open(this.options.location, function (err, connection) {
      if (err) throw err;
      this.connection = connection;
      cb();
    }.bind(this));
  },

  disconnect: function (cb) {},

  getBin: function (params, cb) {
    this.connection
      .use('bins')
      .findById(params.id)
      .exec(function (err, bin) {
        if (err) return cb(err);
        // Get the requested revision
        var revision = bin[params.revision];
        // Apply bin defaults
        revision = _.defaults(revision, {
          url: params.id,
          revision: params.revision,
          id: params.id + params.revision,
          html: '',
          css: '',
          javascript: '',
          active: true,
          settings: {}
        });
        if (revision.active === 'false') revision.active = false;
        else revision.active = true;
        cb(null, revision);
      });
  },

  setBin: function (params, cb) {
    var data = {
      _id: params.url
    };
    data[params.revision] = {
      javascript: params.javascript || '',
      css: params.css || '',
      html: params.html || '',
      active: true,
      settings: {}
    };
    this.connection
      .use('bins')
      .save(data)
      .exec(function (err, bin) {
        if (err) return cb(err);
        cb(null, params.revision);
      });
  },

  setBinOwner: function (params, cb) {
    cb(null, null);
  },
  setBinPanel: function (panel, params, cb) {
    cb(null, null);
  },
  getLatestBin: function (params, cb) {
    this.connection
      .use('bins')
      .findById(params.id)
      .exec(function (err, bin) {
        if (err) return cb(err);
        // Get the latest revision
        var revisions = Object.keys(bin).map(function (revision) {
          return parseInt(revision, 10);
        }).filter(function (val) { return !!val; });

        var revision = bin[''+Math.max.apply(Math, revisions)];

        // Apply bin defaults
        revision = _.defaults(revision, {
          url: params.id,
          revision: params.revision,
          id: params.id + params.revision,
          html: '',
          css: '',
          javascript: '',
          active: true,
          settings: {}
        });
        if (revision.active === 'false') revision.active = false;
        else revision.active = true;
        cb(null, revision);
      });
  },
  getLatestBinForUser: function (id, n, cb) {
    cb(null, null);
  },
  getBinsByUser: function (id, cb) {
    cb(null, null);
  },
  getAllOwners: function (cb) {
    cb(null, null);
  },
  getOwnersBlock: function (start, size, cb) {
    cb(null, null);
  },
  generateBinId: function (cb, attempts) {
    var id = utils.shortcode();
    cb(null, id);
  },
  archiveBin: function (bin, cb) {
    cb(null, null);
  },
  getUser: function (id, cb) {
    cb(null, null);
  },
  getUserByApiKey: function (email, cb) {
    cb(null, null);
  },
  getUserByEmail: function (email, cb) {
    cb(null, null);
  },
  setUser: function (params, cb) {
    cb(null, null);
  },
  touchOwners: function (params, cb) {
    cb(null, null);
  },
  updateOwners: function (params, cb) {
    cb(null, null);
  },
  populateOwners: function (params, cb) {
    cb(null, null);
  },
  touchLogin: function (id, cb) {
    cb(null, null);
  },
  updateUserEmail: function (id, email, cb) {
    cb(null, null);
  },
  updateUserGithubData: function (id, token, cb) {
    cb(null, null);
  },
  updateUserKey: function (id, key, cb) {
    cb(null, null);
  },
  // Different to updateUserKey() in that it also sets the created timestamp
  // which is required to differentiate between a JSBin 2 user and a new
  // one.
  upgradeUserKey: function (id, key, cb) {
    cb(null, null);
  },
  getUserByForgotToken: function (token, cb) {
    cb(null, null);
  },
  setForgotToken: function (user, token, cb) {
    cb(null, null);
  },
  expireForgotToken: function (token, cb) {
    cb(null, null);
  },
  expireForgotTokenByUser: function (user, cb) {
    cb(null, null);
  },
  expireDate: function () {

  },
  applyBinDefaults: function (bin) {

  },
  reportBin: function (params, cb) {
    cb(null, null);
  },
  isOwnerOf: function (params, cb) {
    cb(null, {
      isowner: true
    });
  },
  getUserBinCount: function (id, cb) {
    cb(null, { total: 0 }); // TODO read directory for count
  }
});
