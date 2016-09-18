/*jshint esversion: 6*/
/*global sw, self, Request, Response, caches, root*/

const OK = JSON.stringify({ ok: true });

sw.save = event => {
  const clone = event.request.clone();
  const url = new URL(event.request.url);
  let localres = null;
  let promise = [fetch(event.request)];
  let backupSaveTimer = null;
  if (url.pathname !== '/save') {
    // save to local at the same time
    localres = localSave(event, clone);
  } else {
    promise.push(new Promise(resolve => {
      backupSaveTimer = setTimeout(() => {
        backupSaveTimer = null;
        resolve(localSave(event, clone));
      }, 10 * 1000); // after 10 seconds, assume a problem and save locally
    }));
  }

  // potential area for lie-fi concern - waiting for fetch to complete first
  return Promise.race(promise).then(res => {
    clearTimeout(backupSaveTimer);
    if (res.status === 200 && backupSaveTimer) {
      // then we want to capture the latest update
      return res.clone().json().then(json => {
        localSave(event, clone, json.code);
        return res;
      });
    } else if (res.status === 200) {
      return res;
    }

    // if it errored for some reason, let's still save the user content
    // throw new Error('failed to save online');
    return localSave(event, clone, null, JSON.stringify({ error: true }));
  }).catch(e => {
    return localres || localSave(event, clone);
  });
};

function localSave(event, request, code, ok) {
  if (!ok) {
    ok = OK;
  }
  const url = new URL(request.url);
  return caches.open(binCache).then(cache => {
    // this means we tried to save whilst we were offline
    if (url.pathname === '/save') {
      // then we have a new bin, let's generate one offline
      if (!code) {
        code = sw.generateUUID();
      }
      const edit = `${root}/${code}/1`;
      const now = new Date().toJSON();
      const res = new Response(JSON.stringify({
        code,
        root,
        created: now,
        updated: now,
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
      const req = new Request(`${root}/${code}`);
      request.text().then(body => {
        const bin = sw.paramsToObject(body);
        if (bin.settings) {
          bin.settings = JSON.parse(bin.settings);
        }

        bin.code = code;
        bin.updated = new Date().toJSON();

        const res = new Response(JSON.stringify(sw.prepareStart(bin)), {
          headers: {
            'content-type': 'application/json',
          },
        });

        cache.put(req, res);
      });

      return res;
    } else {
      // update the existing bin in our cache
      // 1. find the bin
      return sw.getBinForClient(event.clientId).then(res => {
        if (res) {
          return Promise.all([res.json(), request.text()]).then(res => {
            const update = sw.paramsToObject(res[1]);
            const bin = res[0];
            bin.template[update.panel] = update.content;
            bin.jsbin.settings = JSON.parse(update.settings);
            bin.updated = new Date().toJSON();
            ['html', 'css', 'javascript', 'code'].map(_ =>
              bin[_] = bin.template[_]);

            const response = new Response(
              JSON.stringify(sw.prepareStart(bin)),
              {
                headers: {
                  'content-type': 'application/json',
                },
              }
            );

            const req = new Request(`${root}/${bin.template.code}`);

            return cache.put(req, response).then(() => {
              return new Response(OK, {
                headers: {
                  'content-type': 'application/json',
                },
              });
            });
          });
        } else {
          return request.text().then(res => {
            // here we have a save event but we don't have a local copy
            // so we're going to hit the jsbin API to get the initial content
            // then add to it and store in our local cache.
            const body = sw.paramsToObject(res);
            return fetch(`/api/${body.code}`, { credentials: 'include' }).then(res => {
              return res.json();
            }).then(bin => {
              // massarge the data
              bin.checksum = body.checksum;
              bin.code = bin.url;
              bin.updated = bin.last_updated;
              bin.jsbin = {
                settings: bin.settings,
              };

              const res = new Response(JSON.stringify(sw.prepareStart(bin)), {
                headers: {
                  'content-type': 'application/json',
                },
              });

              const req = new Request(`${root}/${bin.code}`);

              return cache.put(req, res).then(() => res);
            });
          });
        }
      });
    }
  });


}
