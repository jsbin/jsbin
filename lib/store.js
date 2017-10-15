var metrics = require('./metrics'),
    RSVP = require('rsvp');

function Store(options) {
  if (options.adapter !== 'mysql') {
    throw new Error(`${options.adapter} is not supported, only mysql as of v4.`);
    process.exit(1);
  }
  var Adapter = require('./db/' + options.adapter);
  this.adapter = new Adapter(options[options.adapter]);
  check(this.adapter, methods);
}

function noopWithCallback () {
  var callback = arguments[arguments.length - 1];
  callback(null, {});
}

var check = function (adapter, methods) {
  methods.forEach(function (method) {
    if (!adapter[method]) {
      console.error('DB adapter missing method: ' + method);
      adapter[method] = noopWithCallback;
    }
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
  'getUserListing',
  'setBinVisibility',
  'updateBinData',
  'updateOwnersData',
  'updateOwnershipData',
  'saveBookmark',
  'getBookmark',
  'getAssetsForUser',
  'saveAsset',
  'deleteUser',
  'deleteAsset'
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
