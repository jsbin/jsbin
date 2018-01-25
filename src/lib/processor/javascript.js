import { JAVASCRIPT } from '../cm-modes';
import loopProtection from 'loop-protect';
import callback from './loop-protect-callback';
let Babel = null;

export const transform = async source => {
  const sourceFileName =
    (window.location.pathname.split('/').pop() || 'untitled') + '.js';

  if (
    !(
      source.includes('for') ||
      source.includes('import') ||
      source.includes('while')
    ) ||
    source.includes('noprotect')
  ) {
    return { code: `${source}\n//# sourceURL=${sourceFileName}`, map: null };
  }

  if (Babel === null) {
    Babel = await import(/* webpackChunkName: "babel" */ 'babel-standalone');
    Babel.registerPlugin('loopProtection', loopProtection(100, callback));
  }

  let res = source;

  try {
    const transformed = Babel.transform(source, {
      sourceMap: 'both',
      plugins: ['loopProtection'],
      // sourceType: this is a bit of a wild guess, but making it a module
      // means that the console doesn't have access to variables inside
      // this might lead to unexpected results for the user.
      sourceType: source.includes('import') ? 'module' : 'script',
      sourceFileName,
      ast: false,
      minified: true,
    });

    res = {
      code: transformed.code,
      map: transformed.map,
      module: transformed.metadata.modules.imports.length > 0,
    };
  } catch (e) {
    console.error(e.message);
    res = {
      code: `throw new Error("Failed to compile - if this continues, please file a new issue and include this full source and configuration")`,
    };
  }

  return res;
};

export const config = {
  name: JAVASCRIPT,
  label: 'JavaScript',
  for: JAVASCRIPT,
  mode: JAVASCRIPT,
};
