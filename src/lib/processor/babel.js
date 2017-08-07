import { JAVASCRIPT } from '../cm-modes';

export async function transform(source) {
  const Babel = await import(/* webpackChunkName: "babel" */ 'babel-standalone');
  return Babel.transform(source, { presets: ['es2015', 'react', 'stage-0'] })
    .code;
}

export const config = {
  name: 'babel',
  label: 'Babel + React',
  for: JAVASCRIPT,
  mode: 'text/jsx',
};
