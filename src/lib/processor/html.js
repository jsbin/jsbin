import { HTML } from '../cm-modes';

export const transform = source => source;

export const config = {
  name: HTML,
  label: 'HTML',
  for: HTML,
  mode: {
    name: 'htmlmixed',
    scriptTypes: [
      {
        matches: /\/x-handlebars-template|\/x-mustache/i,
        mode: null,
      },
    ],
  },
};
