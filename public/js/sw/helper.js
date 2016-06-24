/*jshint esversion: 6*/
/*global sw, self*/

sw.newBinStartScript = ({ template, jsbin }) => {
  return `start(${safeStringify(template)}, ${safeStringify(jsbin)}, this, document);`; // jshint ignore:line
};

sw.prepareStart = bin => {
  const template = ['html', 'css', 'javascript', 'code'].reduce((acc, curr) => {
    acc[curr] = bin[curr];
    return acc;
  }, {});

  const jsbin = {
    state: {
      processors: bin.jsbin && bin.jsbin.settings ? bin.jsbin.settings.processors : {},
      metadata: {
        'last_updated': bin.updated,
      },
      code: template.code,
      checksum: template.code,
    },
    user: {},
    settings: {
      panels: [],
    },
  };

  return {
    template,
    jsbin,
  };
};

function safeStringify(source) {
  return JSON.stringify(source)
             .replace(/<\/script/gi, '<\\/script')
             .replace(/<!--/g, '<\\!--');
}

sw.paramsToObject = string => {
  const res = {};
  for (let [key, value] of new URLSearchParams(string).entries()) {
    res[key] = value;
  }
  return res;
};

sw.getBinForClient = clientId => {
  return clients.get(clientId).then(client => sw.getBin(new URL(client.url)));
};

sw.getBin = (url) => {
  return caches.open(binCache).then(cache => {
    // 3. and try to find the request based on this url
    let pathname = url.pathname.split('/').filter(Boolean).shift();
    return cache.match(`${url.origin}/${pathname}`);
  });
};

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

sw.generateUUID = () => {
  return Array.from({ length: 8 }).map(S4).join('');
};
