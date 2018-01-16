import { JAVASCRIPT } from '../cm-modes';
import loopProtection from 'loop-protect';
let Babel = null;

export const transform = async source => {
  if (
    !(source.includes('for') || source.includes('while')) ||
    source.includes('noprotect')
  ) {
    return { code: source, map: null };
  }

  if (Babel === null) {
    Babel = await import(/* webpackChunkName: "babel" */ 'babel-standalone');
    const callback = (lineno, colno) => {
      const message = `Exiting potential infinite loop on line ${lineno}`;
      window.dispatchEvent(new CustomEvent('error', {
        detail: {
          error: { name: 'loopProtect', stack: `Use // noprotect to disable JS Bin's loop protection` },
          lineno,
          colno,
          message,
        }
      }));
    };
    Babel.registerPlugin('loopProtection', loopProtection(100, callback));
  }

  let res = source;

  try {
    res = Babel.transform(source, {
      plugins: ['loopProtection'],
      sourceMap: 'both',
      sourceType: 'script',
      sourceFileName: 'misty-sea-B07.js'
    });
  } catch (e) {
    console.error(e.message);
  }

  return res;
};

export const config = {
  name: JAVASCRIPT,
  label: 'JavaScript',
  for: JAVASCRIPT,
  mode: JAVASCRIPT,
};
