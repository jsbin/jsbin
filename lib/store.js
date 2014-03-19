var metrics = require('./metrics'),
    RSVP = require('rsvp');

function Store(options) {
  var Adapter = require('./db/' + options.adapter);
  this.adapter = new Adapter(options[options.adapter]);
  check(this.adapter, methods);
}

var check = function (adapter, methods) {
  methods.forEach(function (method) {
    if (!adapter[method]) throw new Error("DB adapter missing method: " + method);
  });
};

// Methods that should be supported by adaptors.
var methods = [
  'connect',
  'disconnect',
  'setBin',
  'setBinOwner',
  'setBinPanel',
  'getBin',
  'getLatestBin',
  'getLatestBinForUser',
  'getBinsByUser',
  'generateBinId',
  'archiveBin',
  'getUser',
  'getUserByEmail',
  'getUserByApiKey',
  'setUser',
  'touchLogin',
  'touchOwners',
  'updateOwners',
  'updateUserEmail',
  'updateUserGithubData',
  'updateUserKey',
  'upgradeUserKey',
  'getUserByForgotToken',
  'setForgotToken',
  'expireForgotToken',
  'expireForgotTokenByUser',
  'reportBin',
  'getAllOwners',
  'updateUserSettings',
  'getOwnersBlock',
  'isOwnerOf',
  'getUserBinCount',
  'populateOwners',
  'getOne',
  'getBinMetadata',
  'setBinVisibility',
  'setProAccount',
  'updateBinData',
  'updateOwnersData',
];

// Proxy the methods through the store.
methods.forEach(function (method) {
  Store.prototype[method] = function () {
    metrics.increment('db.method');
    metrics.increment('db.method.' + method);

    var args = Array.apply([], arguments);
    
    if (args.slice(-1)[0].constructor === Function) {
      this.adapter[method].apply(this.adapter, arguments);
    } else {
      return new RSVP.Promise(function (resolve, reject) {
        args.push(function (error, result) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }); 
        this.adapter[method].apply(this.adapter, args);
      }); 
    }

  };
});

module.exports = function createStore(options) {
  return new Store(options);
};
module.exports.Store = Store;
