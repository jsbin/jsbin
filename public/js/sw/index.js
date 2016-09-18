/* global self, caches, fetch, URL, version, scripts, Response, clients */
/* jshint esversion: 6 */

const sw = {}; // imported scripts attach to this
const binCache = 'bins';
const staticCacheName = version + '-v1';
let acceptCacheQueue = {};
importScripts(
  rootStatic + '/js/sw/helper.js?' + version,
  rootStatic + '/js/sw/save.js?' + version,
  rootStatic + '/js/vendor/bin-to-file.min.js?' + version,
  rootStatic + '/js/sw/clean-up.js?' + version
);
const empty = {};
const emptyBinUrl = '/bin/start.js?new=1';
self.addEventListener('install', e => {
  // once the SW is installed, go ahead and fetch the resources to make this
  // work offline
  e.waitUntil(
    caches.open(staticCacheName).then(cache => {
      const fetches = scripts.map(req => {
        return fetch(req, { mode: 'no-cors' }).then(res => {
          return cache.put(req, res);
        });
      });

      return Promise.all(fetches).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  acceptCacheQueue = {}; // try to clear up some memory
  return event.waitUntil(self.clients.claim());
});

self.addEventListener('message', event => {
  let data = null;
  try {
    data = JSON.parse(event.data);
  } catch (e) {
    return;
  }

  if (data.type === 'accept-cache' && acceptCacheQueue[data.id]) {
    acceptCacheQueue[data.id].resolve();
    delete acceptCacheQueue[data.id];
  }
});

self.addEventListener('fetch', event => {
  let req = event.request;

  const url = new URL(req.url);

  if (url.pathname.endsWith('/save')) {
    event.respondWith(sw.save(event));
    return;
  }

  if (url.pathname === '/logout') {
    event.respondWith(fetch(event.request).then(res => {
      return caches.delete(staticCacheName).then(() => {
        self.registration.unregister();
        return res;
      });
    }));
    return;
  }

  // here be: the bin boot up code 🐲
  if (url.pathname === '/bin/start.js') {
    const cached = getCachedBin(event);

    // this is a beacon to the client that we have a cached copy
    const userAccepts = cached.then(json => {
      if (json) {
        return new Promise(resolve => {
          acceptCacheQueue[event.clientId] = {
            resolve: () => {
              resolve(binAsStartScript(json));
            },
          };

          clients.get(event.clientId).then(client => {
            console.log('notifying of cached copy');
            client.postMessage(JSON.stringify({
              type: 'cached',
              id: event.clientId,
              updated: json.jsbin.state.metadata.last_updated,
              template: json.template,
              processors: json.jsbin.state.processors,
            }));
          });
        });
      }

      // send empty bin after 10 seconds of waiting
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(caches.match(emptyBinUrl));
        }, 10 * 1000);
      });
    });

    const race = Promise.race([userAccepts, fetch(event.request)]);

    event.respondWith(race.then(res => {
      if (res.status >= 500) {
        throw new Error('bad response from server: ' + res.status);
      }

      return res;
    }).catch(e => {
      console.log('boot script failed over network, sending cache: ' + e.message);
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

  // basically ignoreSearch, but it's not supported yet
  if (url.pathname === '/' ||
      url.pathname === '/bin/user.js' ||
      url.pathname === '/images/default-avatar.min.svg' ||
      url.pathname.indexOf('/js/') === 0) {
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
    caches.open(staticCacheName).then(staticCache => {
      return staticCache.match(req).then(res => {
        // also cache this if it's a gravatar
        if (url.origin.includes('gravatar.com') && !res) {
          staticCache.add(req.url);
        }
        return res;
      });
    }).then(res => {
      // either send:
      // - cached resource
      // - fetch the resource
      // - or send an empty body (this gives *something* back to quiet down the errors)
      return res || fetch(event.request).then(res => {
        if (res.status >= 500) {
          throw new Error('bad response from server: ' + res.status);
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

        // let's see if we can find a bin locally that matches
        return sw.getBin({ origin: url.origin, pathname }).then(res => {
          if (!res) {
            // give up
            return new Response('');
          }

          // else try to render using the binToFile logic
          return res.json().then(bin => {
            bin.template.processors = bin.jsbin.state.processors;
            bin.source = bin.template;
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
      'x-via': 'service-worker',
    },
  }));
}
