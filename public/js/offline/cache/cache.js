// var cacheDB = require('./cachedb');

var Cache = (function () {

  function Cache() {
    this._name = '';
    this._origin = '';
  }

  var CacheProto = Cache.prototype;

  CacheProto.match = function(request, params) {
    return cacheDB.match(this._origin, this._name, request, params);
  };

  CacheProto.matchAll = function(request, params) {
    return cacheDB.matchAll(this._origin, this._name, request, params);
  };

  CacheProto.addAll = function(requests) {
    Promise.all(
      requests.map(function(request) {
        return fetch(request);
      })
    ).then(function(responses) {
      return cacheDB.put(this._origin, this._name, responses.map(function(response, i) {
        return [requests[i], response];
      }));
    }.bind(this));
  };

  CacheProto.add = function(request) {
    return this.addAll([request]);
  };

  CacheProto.put = function(request, response) {
    if (!(response instanceof Response)) {
      throw TypeError("Incorrect response type");
    }

    return cacheDB.put(this._origin, this._name, [[request, response]]);
  };

  CacheProto.delete = function(request, params) {
    return cacheDB.delete(this._origin, this._name, request, params);
  };

  CacheProto.keys = function(request, params) {
    if (request) {
      return cacheDB.matchAllRequests(this._origin, this._name, request, params);
    }
    else {
      return cacheDB.allRequests(this._origin, this._name);
    }
  };

  return Cache;
})();