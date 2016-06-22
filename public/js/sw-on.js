/* global self, caches, fetch, URL, version, scripts, Response, Request, root */
/* jshint esversion: 6 */

importScripts('/js/sw-helper.js');
const staticCacheName = version + '-v1';
const binCache = 'bins';
const emptyBinUrl = '/bin/start.js?new=1';
self.addEventListener('install', e => {
  // once the SW is installed, go ahead and fetch the resources to make this
  // work offline
  e.waitUntil(
    caches.open(staticCacheName).then(cache => {
      const urls = scripts.map(_ => {
        if (typeof _ === 'string') {
          return _;
        }
        return new Request(_.url, _);
      });
      return cache.addAll(urls).then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  let req = event.request;

  const url = new URL(req.url);

  if (url.pathname.endsWith('/save')) {
    const clone = event.request.clone();
    event.respondWith(fetch(event.request).catch(() => {
      console.log(url.pathname);
      return caches.open(binCache).then(cache => {
        // this means we tried to save whilst we were offline
        if (url.pathname === '/save') {
          // then we have a new bin, let's generate one offline
          const code = generateUUID();
          const edit = `${root}/${code}/1`;
          const res = new Response(JSON.stringify({
            code,
            root,
            created: new Date().toJSON(),
            checksum: code,
            revision: 1,
            latest: true,
            url: edit,
            edit: edit,
            html: edit,
            js: edit,
            allowUpdate: true,
          }), {
            headers: {
              'content-type': 'application/json',
            },
          });

          // try to find the request based on this url
          const req = new Request(`${root}/${code}/edit`);
          clone.text().then(body => {
            const bin = paramsToObject(body);
            if (bin.settings) {
              bin.settings = JSON.parse(bin.settings);
            }

            bin.code = code;

            const res = new Response(JSON.stringify(prepareStart(bin)), {
              headers: {
                'content-type': 'application/json'
              }
            });

            cache.put(req, res);
          });

          return res;
        } else {
          // update the existing bin in our cache
          // 1. find the bin
          return getBinForClient(event.clientId).then(res => {
            if (res) {
              return Promise.all([res.json(), clone.text()]).then(res => {
                const update = paramsToObject(res[1]);
                const bin = res[0];
                bin.template[update.panel] = update.content;
                bin.jsbin.settings = JSON.parse(update.settings);
                ['html', 'css', 'javascript', 'code'].map(_ => bin[_] = bin.template[_]);
                const response = new Response(JSON.stringify(prepareStart(bin)), {
                  headers: {
                    'content-type': 'application/json'
                  }
                });

                const req = new Request(`${root}/${bin.template.code}/edit`);

                return caches.open(binCache).then(cache => {
                  return cache.put(req, response);
                }).then(() => {
                  return new Response(JSON.stringify({ ok: true, checksum: bin.jsbin.state.checksum }), {
                    headers: {
                      'content-type': 'application/json'
                    }
                  });
                });
              });
            }

            console.log('>>>>>>');
            debugger;
          });
          // 2. get the updated content and update the bin
          // 3. push back into the cache
        }
      });
    }));

    return;
  }

  // here be: the bin boot up code 🐲
  if (url.pathname === '/bin/start.js') {
    event.respondWith(fetch(event.request).catch(() => {
      // TODO try to find a cached version
      // if the request fails, try to find the bin based on the url

      return getBinForClient(event.clientId).then(res => {
        if (res) {
          return res.json().then(json => {
            return new Response(newBinStartScript(json, {
              headers: {
                'content-type': 'text/script'
              }
            }));
          });
        }

        // return the cached bin or a new (empty) bin
        return caches.match(emptyBinUrl);
      });
    }));

    return;
  }

  if (url.pathname === '/' || url.pathname === '/bin/user.js') {
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
      return res || fetch(event.request);
    })
  );
});

function getBinForClient(clientId) {
  return clients.get(clientId).then(client => getBin(new URL(client.url)));
}

function getBin(url) {
  return caches.open(binCache).then(cache => {
    // 3. and try to find the request based on this url
    return cache.match(url.origin + url.pathname);
  });
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function generateUUID() {
  return Array.from({ length: 8 }).map(S4).join('');
}
