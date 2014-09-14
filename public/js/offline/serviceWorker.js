/* global importScripts, ctr */
importScripts('/js/offline/cache/idbhelper.js');
importScripts('/js/offline/cache/cachedb.js');
importScripts('/js/offline/cache/cache.js');
importScripts('/js/offline/cache/caches.js');

var version = 'v2';

function log() {
  var args = [].slice.call(arguments);
  if (args[0].request.url === 'https://rem.jsbin-dev.com/') {
    var event = args.shift();
    args.unshift(event.request.url);
    console.log.apply(console, args);
  }
}

console.log('loaded');

this.addEventListener('install', function(event) {
  event.waitUntil(
    polyfillCaches.get(version).then(function (cache) {
      return cache || polyfillCaches.create(version);
    })
  );
});

this.addEventListener('fetch', function(event) {
  event.respondWith(
    polyfillCaches.match(event.request).then(function (res) {
      if (res) {
        log(event, 'returned from cache');
      } else {
        log(event, 'requested from network', event);
      }

      return res || fetch(event.request.url, {
        credentials: 'include'
      }).then(function (res) {

        log(event, 'fetch complete for ' + event.request.url);

        polyfillCaches.get(version).then(function (cache) {
          log(event, 'Added ' + event.request.url + ' to cache');
          cache.put(event.request, res).then(function () {
            log(event, 'put was good');
          }).catch(function (e) {
            log(event, e.trace);
          });
        }).catch(function (error) {
          log(event, 'something went wrong', error);
          throw error;
        });



        return res;

      }).catch(function (error) {
        log(event, 'err on fetch', error);
        throw error;
      });
    })
  );
});
