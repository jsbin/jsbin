/* global importScripts, ctr */
importScripts('/js/offline/cache/idbhelper.js');
importScripts('/js/offline/cache/cachedb.js');
importScripts('/js/offline/cache/cache.js');
importScripts('/js/offline/cache/caches.js');

var ctr = 0;
var version = 'v2';

function log() {
  var args = [].slice.call(arguments);
  if (args[0].request.url === 'https://rem.jsbin-dev.com/') {
    args.shift();
    console.log.apply(console, args);
  }
}

console.log('just watching for /');

this.addEventListener('fetch', function(event) {
  event.respondWith(
    polyfillCaches.match(event.request).then(function (res) {
      if (res) {
        log(event, 'returned from cache');
      } else {
        log(event, 'requested from network');
      }

      return res || fetch(event.request.url).then(function (res) {


        polyfillCaches.get(version).then(function (cache) {
          return cache || polyfillCaches.create(version);
        }).then(function (cache) {
          log(event, 'Added ' + event.request.url + ' to cache');
          cache.put(event.request, res).then(function () {
            log(event, 'put was good');
          }).catch(function (e) {
            log(event, e.trace);
          });
        });



        return res;

      });
    })
  );
});
