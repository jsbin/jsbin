var metrics = require('./metrics');

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
  'updateUserDropboxData',
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
  'setProAccount',
  'setCustomer',
  'setCustomerActive',
  'getCustomerByStripeId',
  'getCustomerByUser',
  'getBinMetadata',
  'setBinVisibility',
  'updateBinData',
  'updateOwnersData',
  'updateOwnershipData',
  'saveBookmark',
  'getBookmark',
];

// Proxy the methods through the store.
methods.forEach(function (method) {
  Store.prototype[method] = function () {
    metrics.increment('db.method');
    metrics.increment('db.method.' + method);
    this.adapter[method].apply(this.adapter, arguments);
  };
});

module.exports = function createStore(options) {
  return new Store(options);
};
module.exports.Store = Store;
