import { HTML } from '../cm-modes';

export async function transform(source) {
  let res = source;
  try {
    const pug = await import(/* webpackChunkName: "pug" */ 'pug');
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
