import { HTML } from '../cm-modes';

export async function transform(source) {
  const pug = await import(/* webpackChunkName: "pug" */ 'pub');
  let res = source;
  try {
    res = pug.render(source);
  } catch (e) {
    console.error(e);
  }
  return res;
}

export const config = {
  name: 'pug',
  label: 'Pug (Jade)',
  for: HTML,
  mode: { name: 'pug', alignCDATA: true },
};
