import { CSS } from '../cm-modes';

export async function transform(source) {
  const Sass = await import(/* webpackChunkName: "sass" */ './_sass.js');
  return new Promise((resolve, reject) => {
    Sass.setWorkerUrl('sass.js/dist/sass.worker.js');
    const sass = new Sass();

    sass.compile(source, { indentedSyntax: true }, result => {});
  });
}

export const config = {
  name: 'sass',
  label: 'Sass',
  for: CSS,
  mode: 'text/x-sass',
};
