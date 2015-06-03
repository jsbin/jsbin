/* global importScripts, ctr */

 // polyfill via https://github.com/coonsta/cache-polyfill
importScripts('/js/offline/cache/index.js');

var CACHE_NAME = 'jsbin-v3';

function log() {
  var args = [].slice.call(arguments);
  if (args[0].request.url === 'https://rem.jsbin-dev.com/') {
    var event = args.shift();
    args.unshift(event.request.url);
    console.log.apply(console, args);
  }
}

console.log('loaded %s', CACHE_NAME);

this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache || caches.create(CACHE_NAME);
    })
  );
});

this.addEventListener('fetch', function(event) {
  console.log('fetch', event);
  event.respondWith(
    caches.match(event.request).then(function (res) {
      if (res) {
        log(event, 'returned from cache');
      } else {
        log(event, 'requested from network', event);
      }

      return res || fetch(event.request.url, {
        credentials: 'include'
      }).then(function (res) {

        log(event, 'fetch complete for ' + event.request.url);

        caches.open(CACHE_NAME).then(function (cache) {
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
