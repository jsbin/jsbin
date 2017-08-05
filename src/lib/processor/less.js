import { CSS } from '../cm-modes';

let last = '';

export async function transform(source) {
  const less = await import(/* webpackChunkName: "less" */ 'less');
  return new Promise((resolve, reject) => {
    less.render(source, (e, output) => {
      if (e) {
        console.log(e);
        return last;
      }
      last = output.css;
      resolve(output.css);
    });
  });
}

export const config = {
  name: 'less',
  label: 'Less',
  for: CSS,
  mode: 'text/x-less',
};
