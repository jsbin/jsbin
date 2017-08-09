import { HTML } from '../cm-modes';

export async function transform(source) {
  const commonmark = await import(/* webpackChunkName: "commonmark" */ 'commonmark');
  const reader = new commonmark.Parser();
  const writer = new commonmark.HtmlRenderer();

  return writer.render(reader.parse(source));
}

export const config = {
  name: 'markdown',
  label: 'Markdown',
  for: HTML,
  mode: {
    name: 'gfm',
    tokenTypeOverrides: {
      emoji: true,
      taskLists: true,
      strikethrough: true,
      gitHubSpice: false,
    },
  },
};
