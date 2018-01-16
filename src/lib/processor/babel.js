import { JAVASCRIPT } from '../cm-modes';

let Babel = null;
const cache = {};
let todo = [];

const replaceImports = () => ({
  visitor: {
    ModuleDeclaration(path) {
      const value = path.node.source.value;
      if (cache[value]) {
        path.node.source.value = cache[value];
      }
    },
  },
});

const collectImports = () => ({
  visitor: {
    ModuleDeclaration(path) {
      const moduleName = path.node.source.value;
      if (!cache[moduleName]) {
        const value = [moduleName];

        if (!moduleName.startsWith('http')) {
          value.push('https://unpkg.com/' + moduleName);
        }
        todo.push(value);
      }
    },
  },
});

const getOutstandingPromises = async () => {
  return Promise.all(
    todo.map(([name, url = name]) => {
      return fetch(url).then(res => (cache[name] = res.url));
    })
  );
};

export async function transform(source) {
  if (Babel === null) {
    Babel = await import(/* webpackChunkName: "babel" */ 'babel-standalone');
    Babel.registerPlugin('collectImports', collectImports);
    Babel.registerPlugin('replaceImports', replaceImports);
  }
  let res = source;
  try {
    Babel.transform(source, {
      presets: ['es2015', 'react', 'stage-0'],
      plugins: ['collectImports'],
    });

    await getOutstandingPromises();
    todo = [];

    res =
      requires +
      Babel.transform(source, {
        presets: ['es2015', 'react', 'stage-0'],
        plugins: ['replaceImports'],
      }).code;
  } catch (e) {
    console.log(e);
  }
  return res;
}

export const config = {
  name: 'babel',
  label: 'Babel + React',
  for: JAVASCRIPT,
  mode: 'text/jsx',
};

// this is cheap support for require based on https://github.com/remy/require-for-dev
// which frankly, I'm amazed actually works without any serious changes.
const requires = `// this is cheap support for require based on https://github.com/remy/require-for-dev
window.require = function (path) {
  'use strict';
  var xhr = new XMLHttpRequest();
  var root = location.pathname.split('/').slice(1, -1).join('/') + '/';

  // try to return the cache
  var frame = document.getElementById(path);
  if (frame) {
    return frame.contentWindow.module.exports;
  }

  xhr.open('GET', path, false); // sync
  xhr.send();

  var code = xhr.responseText;

  if (code.indexOf('//# sourceURL') === -1) {
    code += '\\n\\n//# sourceURL=' + location.protocol + '//' + location.host + path;
  }

  // http://lists.whatwg.org/htdig.cgi/whatwg-whatwg.org/2013-October/041171.html
  // about:blank is evaluated synchronously so we have access to the
  // frame.contentWindow right after attaching it to the DOM!
  frame = document.createElement('iframe');

  frame.id = path;

  document.documentElement.appendChild(frame);
  frame.setAttribute('style', 'display: none !important');

  var module = { exports : {} };

  // assign module globals to the empty iframe
  frame.contentWindow.require = require;
  frame.contentWindow.module = module;
  frame.contentWindow.exports = module.exports;

  // evaluate the code in the new iframe
  frame.contentWindow.eval(code);

  // Note: we don't remove the iframe for two important reasons:
  // 1. Because removing the iframe strips running JavaScript from memory,
  //    so function references we passed out via exports are lost.
  // 2. Benefit of a cache: if the iframe exists, we just send back the exports.

  return module.exports;
};`;
