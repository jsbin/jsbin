import { JAVASCRIPT } from '../cm-modes';
import loopProtection from 'loop-protect';
import preview from './transform/preview';
import { babelError } from '../custom-error';
let Babel = null;

/**
 * IMPORTANT: this loop protection code is manually included in this file
 * and not as an export from a common module because webpack runs on _this_
 * code first, then the result is passed to the loop protection, which in
 * turn can't reference the webpack transpiled code.
 **/
function callback(lineno, colno) {
  const detail = {
    error: {
      name: 'loopProtect',
      stack: `Use // noprotect to disable JS Bin's loop protection`,
    },
    lineno,
    custom: true,
    colno,
    message: `Exiting potential infinite loop on line ${lineno}`,
  };

  // important: this code is run inside the runner - but it's assigned from the
  // outer frame (Result)

  // eslint-disable-next-line no-restricted-globals
  self.dispatchEvent(new CustomEvent('error', { detail }));
}

function capturePreview(id, value) {
  const detail = {
    id,
    value,
  };

  // eslint-disable-next-line no-restricted-globals
  self.dispatchEvent(new CustomEvent('preview', { detail }));
  return value;
}

export const transform = async source => {
  const sourceFileName =
    (window.location.pathname.split('/').pop() || 'untitled') + '.js';

  if (
    !(
      source.includes('for') ||
      source.includes('import') ||
      source.includes('while') ||
      source.includes('// ?') ||
      source.includes('//?')
    ) ||
    source.includes('noprotect')
  ) {
    return { code: `${source}\n//# sourceURL=${sourceFileName}`, map: null };
  }

  if (Babel === null) {
    Babel = await import(/* webpackChunkName: "babel" */ 'babel-standalone');
    Babel.registerPlugin('loopProtection', loopProtection(100, callback));
    Babel.registerPlugin('preview', preview(capturePreview));
  }

  let res = source;

  try {
    const transformed = Babel.transform(source, {
      sourceMap: 'both',
      plugins: ['loopProtection', 'preview'],
      // sourceType: this is a bit of a wild guess, but making it a module
      // means that the console doesn't have access to variables inside
      // this might lead to unexpected results for the user.
      sourceType: source.includes('import') ? 'module' : 'script',
      sourceFileName,
      ast: false,
      // minified: true,
    });

    res = {
      code: transformed.code,
      map: transformed.map,
      module: transformed.metadata.modules.imports.length > 0,
    };
  } catch (e) {
    babelError(e);
  }

  return res;
};

export const config = {
  name: JAVASCRIPT,
  label: 'JavaScript',
  for: JAVASCRIPT,
  mode: JAVASCRIPT,
};
