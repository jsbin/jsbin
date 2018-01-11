import { JAVASCRIPT } from '../cm-modes';
import loopProtection from 'loop-protect';
let Babel = null;

export const transform = async source => {
  if (
    !(source.includes('for') || source.includes('while')) ||
    source.includes('noprotect')
  ) {
    return source;
  }

  if (Babel === null) {
    Babel = await import(/* webpackChunkName: "babel" */ 'babel-standalone');
    const callback = line => {
      throw new Error(`Detecting potential infinite loop on line ${line}`);
    };
    Babel.registerPlugin('loopProtection', loopProtection(100, callback));
  }

  let res = source;

  try {
    res = Babel.transform(source, {
      plugins: ['loopProtection'],
    }).code;
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
