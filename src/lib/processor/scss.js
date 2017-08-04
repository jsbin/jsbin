import { CSS } from '../cm-modes';

let last = '';
let Sass = null;

export async function transform(source) {
  if (Sass === null) {
    Sass = await import(/* webpackChunkName: "sass" */ 'sass.js/dist/sass.js');
    Sass.setWorkerUrl('/js/sass.worker.js');
  }

  return new Promise((resolve, reject) => {
    const sass = new Sass();

    sass.compile(source, result => {
      if (result.status === 0) {
        last = result.text;
        return resolve(result.text);
      }

      console.log(new Error(result.formatted));
      resolve(last);
    });
  });
}

export const config = {
  name: 'scss',
  label: 'SCSS',
  for: CSS,
  mode: 'text/x-scss',
};
