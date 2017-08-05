import { CSS } from '../cm-modes';

let result = '';

export async function transform(source) {
  const res = await fetch('https://sassy.glitch.me/', {
    mode: 'cors',
    method: 'post',
    body: JSON.stringify({
      source,
      type: 'scss',
    }),
  });
  if (res.status !== 200) {
    console.log(new Error(res.status));
    return result;
  }

  const data = await res.json();
  if (data.error) {
    console.log(data.error.message);
    return result;
  }

  result = data.result;

  return result;
}

export const config = {
  name: 'scss',
  label: 'SCSS',
  for: CSS,
  mode: 'text/x-scss',
};
