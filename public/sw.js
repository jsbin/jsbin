/* global importScripts, ctr */

 // polyfill via https://github.com/coonsta/cache-polyfill
importScripts('/js/offline/cache/index.js');
importScripts('/js/offline/urls.js');

var CACHE_NAME = 'jsbin-v3.2';

function log() {
  var args = [].slice.call(arguments);
  if (args[0].request.url === 'https://rem.jsbin-dev.com/') {
    var event = args.shift();
    args.unshift(event.request.url);
    console.log.apply(console, args);
  }
}

console.log('loaded %s', CACHE_NAME);

this.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urls);
    })
  );
});

this.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (res) {
      // if res, then we have a catched copy
      return res || fetch(event.request.clone(), {
        credentials: 'include',
      }).then(function (res) {

        if (urls.indexOf(event.request.url) !== -1) {
          caches.open(CACHE_NAME).then(function (cache) {
            console.log(event.request.url, 'Added ' + event.request.url + ' to cache');
            cache.put(event.request, res).then(function () {
              // console.log(event.request.url, 'put was good');
            }).catch(function (e) {
              console.log(event.request.url, e.trace);
            });
          }).catch(function (error) {
            console.log(event.request.url, 'something went wrong', error);
            throw error;
          });
        }

        return res;

      });
    })
  );
});
