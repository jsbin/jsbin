// var IDBHelper = require('./idbhelper');

var cacheDB = (function () {

  function matchesVary(request, entryRequest, entryResponse) {
    if (!entryResponse.headers.vary) {
      return true;
    }

    var varyHeaders = entryResponse.headers.vary.toLowerCase().split(',');
    var varyHeader;
    var requestHeaders = {};

    request.headers.forEach(function(val, key) {
      requestHeaders[key.toLowerCase()] = val;
    });

    for (var i = 0; i < varyHeaders.length; i++) {
      varyHeader = varyHeaders[i].trim();

      if (varyHeader == '*') {
        continue;
      }

      if (entryRequest.headers[varyHeader] != requestHeaders[varyHeader]) {
        return false;
      }
    }
    return true;
  }

  function createVaryID(entryRequest, entryResponse) {
    var id = '';

    if (!entryResponse.headers.vary) {
      return id;
    }

    var varyHeaders = entryResponse.headers.vary.toLowerCase().split(',');
    var varyHeader;

    for (var i = 0; i < varyHeaders.length; i++) {
      varyHeader = varyHeaders[i].trim();

      if (varyHeader == '*') {
        continue;
      }

      id += varyHeader + ': ' + entryRequest.headers[varyHeader] + '\n';
    }

    return id;
  }

  function flattenHeaders(headers) {
    var returnVal = {};
    headers.forEach(function(val, key) {
      returnVal[key.toLowerCase()] = val;
    });

    // so XHR can read the result (we don't have access to this header)
    returnVal['access-control-allow-origin'] = location.origin;
    return returnVal;
  }

  function entryToResponse(entry) {
    var entryResponse = entry.response;
    return new Response(entryResponse.body, {
      status: entryResponse.status,
      statusText: entryResponse.statusText,
      headers: entryResponse.headers
    });
  }

  function responseToEntry(response, body) {
    return {
      body: body,
      status: response.status,
      statusText: response.statusText,
      headers: flattenHeaders(response.headers)
    };
  }

  function entryToRequest(entry) {
    var entryRequest = entry.request;
    return new Request(entryRequest.url, {
      mode: entryRequest.mode,
      headers: entryRequest.headers,
      credentials: entryRequest.headers
    });
  }

  function requestToEntry(request) {
    return {
      url: request.url,
      mode: request.mode,
      credentials: request.credentials,
      headers: flattenHeaders(request.headers)
    };
  }

  function castToRequest(request) {
    if (!(request instanceof Request)) {
      request = new Request(request);
    }
    return request;
  }

  function CacheDB() {
    this.db = new IDBHelper('cache-polyfill', 1, function(db, oldVersion) {
      switch (oldVersion) {
        case 0:
          var namesStore = db.createObjectStore('cacheNames', {
            keyPath: ['origin', 'name']
          });
          namesStore.createIndex('origin', ['origin', 'added']);

          var entryStore = db.createObjectStore('cacheEntries', {
            keyPath: ['origin', 'cacheName', 'request.url', 'varyID']
          });
          entryStore.createIndex('origin-cacheName', ['origin', 'cacheName', 'added']);
          entryStore.createIndex('origin-cacheName-urlNoSearch', ['origin', 'cacheName', 'requestUrlNoSearch', 'added']);
          entryStore.createIndex('origin-cacheName-url', ['origin', 'cacheName', 'request.url', 'added']);
      }
    });
  }

  var CacheDBProto = CacheDB.prototype;

  CacheDBProto._eachCache = function(tx, origin, eachCallback, doneCallback, errorCallback) {
    IDBHelper.iterate(
      tx.objectStore('cacheNames').index('origin').openCursor(IDBKeyRange.bound([origin, 0], [origin, Infinity])),
      eachCallback, doneCallback, errorCallback
    );
  };

  CacheDBProto._eachMatch = function(tx, origin, cacheName, request, eachCallback, doneCallback, errorCallback, params) {
    params = params || {};

    var ignoreSearch = Boolean(params.ignoreSearch);
    var ignoreMethod = Boolean(params.ignoreMethod);
    var ignoreVary = Boolean(params.ignoreVary);
    var prefixMatch = Boolean(params.prefixMatch);

    if (!ignoreMethod &&
        request.method !== 'GET' &&
        request.method !== 'HEAD') {
      // we only store GET responses at the moment, so no match
      return Promise.resolve();
    }

    var cacheEntries = tx.objectStore('cacheEntries');
    var range;
    var index;
    var indexName = 'origin-cacheName-url';
    var urlToMatch = new URL(request.url);

    urlToMatch.hash = '';

    if (ignoreSearch) {
      urlToMatch.search = '';
      indexName += 'NoSearch';
    }

    // working around chrome bugs
    urlToMatch = urlToMatch.href.replace(/(\?|#|\?#)$/, '');

    index = cacheEntries.index(indexName);

    if (prefixMatch) {
      range = IDBKeyRange.bound([origin, cacheName, urlToMatch, 0], [origin, cacheName, urlToMatch + String.fromCharCode(65535), Infinity]);
    }
    else {
      range = IDBKeyRange.bound([origin, cacheName, urlToMatch, 0], [origin, cacheName, urlToMatch, Infinity]);
    }

    IDBHelper.iterate(index.openCursor(range), function(cursor) {
      var value = cursor.value;

      if (ignoreVary || matchesVary(request, cursor.value.request, cursor.value.response)) {
        eachCallback(cursor);
      }
      else {
        cursor.continue();
      }
    }, doneCallback, errorCallback);
  };

  CacheDBProto._hasCache = function(tx, origin, cacheName, doneCallback, errCallback) {
    var store = tx.objectStore('cacheNames');
    return IDBHelper.callbackify(store.get([origin, cacheName]), function(val) {
      doneCallback(!!val);
    }, errCallback);
  };

  CacheDBProto._delete = function(tx, origin, cacheName, request, doneCallback, errCallback, params) {
    var returnVal = false;

    this._eachMatch(tx, origin, cacheName, request, function(cursor) {
      returnVal = true;
      cursor.delete();
    }, function() {
      if (doneCallback) {
        doneCallback(returnVal);
      }
    }, errCallback, params);
  };

  CacheDBProto.matchAllRequests = function(origin, cacheName, request, params) {
    var matches = [];

    request = castToRequest(request);

    return this.db.transaction('cacheEntries', function(tx) {
      this._eachMatch(tx, origin, cacheName, request, function(cursor) {
        matches.push(cursor.key);
        cursor.continue();
      }, undefined, undefined, params);
    }.bind(this)).then(function() {
      return matches.map(entryToRequest);
    });
  };

  CacheDBProto.allRequests = function(origin, cacheName) {
    var matches = [];

    return this.db.transaction('cacheEntries', function(tx) {
      var cacheEntries = tx.objectStore('cacheEntries');
      var index = cacheEntries.index('origin-cacheName');

      IDBHelper.iterate(index.openCursor(IDBKeyRange.bound([origin, cacheName, 0], [origin, cacheName, Infinity])), function(cursor) {
        matches.push(cursor.value);
        cursor.continue();
      });
    }).then(function() {
      return matches.map(entryToRequest);
    });
  };

  CacheDBProto.matchAll = function(origin, cacheName, request, params) {
    var matches = [];

    request = castToRequest(request);

    return this.db.transaction('cacheEntries', function(tx) {
      this._eachMatch(tx, origin, cacheName, request, function(cursor) {
        matches.push(cursor.value);
        cursor.continue();
      }, undefined, undefined, params);
    }.bind(this)).then(function() {
      return matches.map(entryToResponse);
    });
  };

  CacheDBProto.match = function(origin, cacheName, request, params) {
    var match;

    request = castToRequest(request);

    return this.db.transaction('cacheEntries', function(tx) {
      this._eachMatch(tx, origin, cacheName, request, function(cursor) {
        match = cursor.value;
      }, undefined, undefined, params);
    }.bind(this)).then(function() {
      return match ? entryToResponse(match) : undefined;
    });
  };

  CacheDBProto.matchAcrossCaches = function(origin, request, params) {
    var match;

    request = castToRequest(request);

    return this.db.transaction(['cacheEntries', 'cacheNames'], function(tx) {
      this._eachCache(tx, origin, function(cursor) {
        var cacheName = cursor.value.name;

        this._eachMatch(tx, origin, cacheName, request, function(cursor) {
          match = cursor.value;
          // we're done
        }, undefined, undefined, params);

        if (!match) { // continue if no match
          cursor.continue();
        }
      }.bind(this));
    }.bind(this)).then(function() {
      return match ? entryToResponse(match) : undefined;
    });
  };

  CacheDBProto.cacheNames = function(origin) {
    var names = [];

    return this.db.transaction('cacheNames', function(tx) {
      this._eachCache(tx, origin, function(cursor) {
        names.push(cursor.value.name);
        cursor.continue();
      }.bind(this));
    }.bind(this)).then(function() {
      return names;
    });
  };

  CacheDBProto.delete = function(origin, cacheName, request, params) {
    var returnVal;

    request = castToRequest(request);

    return this.db.transaction('cacheEntries', function(tx) {
      this._delete(tx, origin, cacheName, request, params, function(v) {
        returnVal = v;
      });
    }.bind(this), {mode: 'readwrite'}).then(function() {
      return returnVal;
    });
  };

  CacheDBProto.createCache = function(origin, cacheName) {
    return this.db.transaction('cacheNames', function(tx) {
      var store = tx.objectStore('cacheNames');
      store.add({
        origin: origin,
        name: cacheName,
        added: Date.now()
      });
    }.bind(this), {mode: 'readwrite'});
  };

  CacheDBProto.hasCache = function(origin, cacheName) {
    var returnVal;
    return this.db.transaction('cacheNames', function(tx) {
      this._hasCache(tx, origin, cacheName, function(val) {
        returnVal = val;
      });
    }.bind(this)).then(function(val) {
      return returnVal;
    });
  };

  CacheDBProto.deleteCache = function(origin, cacheName) {
    var returnVal = false;

    return this.db.transaction(['cacheEntries', 'cacheNames'], function(tx) {
      IDBHelper.iterate(
        tx.objectStore('cacheNames').openCursor(IDBKeyRange.only([origin, cacheName])),
        del
      );

      IDBHelper.iterate(
        tx.objectStore('cacheEntries').index('origin-cacheName').openCursor(IDBKeyRange.bound([origin, cacheName, 0], [origin, cacheName, Infinity])),
        del
      );

      function del(cursor) {
        returnVal = true;
        cursor.delete();
        cursor.continue();
      }
    }.bind(this), {mode: 'readwrite'}).then(function() {
      return returnVal;
    });
  };

  CacheDBProto.put = function(origin, cacheName, items) {
    // items is [[request, response], [request, response], …]
    var item;

    for (var i = 0; i < items.length; i++) {
      items[i][0] = castToRequest(items[i][0]);

      if (items[i][0].method != 'GET') {
        return Promise.reject(TypeError('Only GET requests are supported'));
      }

      // ensure each entry being put won't overwrite earlier entries being put
      for (var j = 0; j < i; j++) {
        if (items[i][0].url == items[j][0].url && matchesVary(items[j][0], items[i][0], items[i][1])) {
          return Promise.reject(TypeError('Puts would overwrite eachother'));
        }
      }
    }

    return Promise.all(
      items.map(function(item) {
        // item[1].body.asBlob() is the old API
        return item[1].blob ? item[1].blob() : item[1].body.asBlob();
      })
    ).then(function(responseBodies) {
      return this.db.transaction(['cacheEntries', 'cacheNames'], function(tx) {
        this._hasCache(tx, origin, cacheName, function(hasCache) {
          if (!hasCache) {
            throw Error("Cache of that name does not exist");
          }

          items.forEach(function(item, i) {
            var request = item[0];
            var response = item[1];
            var requestEntry = requestToEntry(request);
            var responseEntry = responseToEntry(response, responseBodies[i]);

            var requestUrlNoSearch = new URL(request.url);
            requestUrlNoSearch.search = '';
            // working around Chrome bug
            requestUrlNoSearch = requestUrlNoSearch.href.replace(/\?$/, '');

            this._delete(tx, origin, cacheName, request, function() {
              tx.objectStore('cacheEntries').add({
                origin: origin,
                cacheName: cacheName,
                request: requestEntry,
                response: responseEntry,
                requestUrlNoSearch: requestUrlNoSearch,
                varyID: createVaryID(requestEntry, responseEntry),
                added: Date.now()
              });
            });

          }.bind(this));
        }.bind(this));
      }.bind(this), {mode: 'readwrite'});
    }.bind(this)).then(function() {
      return undefined;
    });
  };

  return new CacheDB();
})();