/* global self, caches, fetch, URL, version, scripts, Response, clients */
/* jshint esversion: 6 */

const sw = {}; // imported scripts attach to this
const binCache = 'bins';
const staticCacheName = version + '-v1';
importScripts('/js/sw/helper.js', '/js/sw/save.js', '/js/vendor/bin-to-file.min.js');
const empty = {};
const emptyBinUrl = '/bin/start.js?new=1';
self.addEventListener('install', e => {
  // once the SW is installed, go ahead and fetch the resources to make this
  // work offline
  e.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(scripts).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  let req = event.request;

  const url = new URL(req.url);

  if (url.pathname.endsWith('/save')) {
    event.respondWith(sw.save(event));
    return;
  }

  // here be: the bin boot up code 🐲
  if (url.pathname === '/bin/start.js') {
    const cached = getCachedBin(event);

    // this is a beacon to the client that we have a cached copy
    cached.then(json => {
      if (json) {
        clients.get(event.clientId).then(client => {
          console.log('notifying of cached copy');
          client.postMessage(JSON.stringify({
            type: 'cached',
            updated: json.jsbin.state.metadata.last_updated,
            template: json.template,
            processors: json.jsbin.state.processors,
          }));
        });
      }
    });

    event.respondWith(fetch(event.request).then(res => {
      if (!res.ok) {
        throw new Error('bad response from server');
      }
      return res;
    }).catch(() => {
      console.log('boot script failed over network, sending cache');
      // if the request fails, try to find the bin based on the url

      // return the cached bin or a new (empty) bin
      return cached.then(json => {
        if (json) {
          return binAsStartScript(json);
        }
        return caches.match(emptyBinUrl);
      });
    }));

    return;
  }

  if (url.pathname === '/' ||
      url.pathname === '/bin/user.js' ||
      url.pathname === '/images/default-avatar.min.svg') {
    // strip the query string
    url.search = '';
    req = url;
  }

  if (url.pathname.endsWith('/edit')) {
    req = '/';
  }

  // when the browser fetches a url, either response with the cached object
  // or go ahead and fetch the actual url
  event.respondWith(
    caches.match(req).then(res => {
      // also cache this if it's a gravatar
      if (url.origin.includes('gravatar.com') && !res) {
        caches.open(staticCacheName).then(cache => cache.add(req.url));
      }

      // either send:
      // - cached resource
      // - fetch the resource
      // - or send an empty body (this gives *something* back to quiet down the errors)
      return res || fetch(event.request).then(res => {
        if (!res.ok) {
          throw new Error('bad response from server: ' + res.statusCode);
        }
        return res;
      }).catch(() => {
        let pathname = url.pathname;
        if (pathname.slice(-1) !== '/') {
          pathname += '/';
        }

        if (!/^\/[\w\d]+\/$/i.test(pathname)) {
          return new Response('');
        }

        // see if we can get this from the cache
        pathname += 'edit';

        return sw.getBin({ origin: url.origin, pathname }).then(res => {
          if (!res) {
            // give up
            return new Response('');
          }

          // else try to render using the binToFile logic
          return res.json().then(bin => {
            bin.template.processors = bin.jsbin.state.processors;
            const html = binToFile(bin.template);
            return new Response(html, {
              headers: {
                'content-type': 'text/html',
              },
            });
          });
        });


      });
      //   const type = event.request.headers.get('accept');
    })
  );
});

function getCachedBin(event) {
  return sw.getBinForClient(event.clientId).then(res => res && res.json());
}

function binAsStartScript(json) {
  return new Response(sw.newBinStartScript(json, {
    headers: {
      'content-type': 'text/script',
    },
  }));
}
