import binToHTML from '../BinToHTML';
import { JAVASCRIPT, HTML, CSS } from '../cm-modes';

// When adding new processors, add it to this line, and add to the `targets`
// object and the rest should hook up automatically.
import * as html from './html';
import * as javascript from './javascript';
import * as css from './css';
import * as markdown from './markdown';
import * as less from './less';
import * as scss from './scss';
import * as babel from './babel';
import * as pug from './pug';

export const NONE = 'none';

const targets = {
  [NONE]: { transform: source => source },
  [html.config.name]: html,
  [css.config.name]: css,
  [javascript.config.name]: javascript,
  [markdown.config.name]: markdown,
  [pug.config.name]: pug,
  [less.config.name]: less,
  [scss.config.name]: scss,
  [babel.config.name]: babel,
};

export function has(target) {
  return !!targets[target];
}

export function getAvailableProcessors(source) {
  return Object.entries(targets)
    .filter(([key, target]) => {
      if (key === NONE) return false;
      return target.config.for === source;
    })
    .map(([key, target]) => {
      return target.config;
    });
}

// this is use for display purposes
export const getConfig = target => targets[target].config;

const last = {
  [JAVASCRIPT]: null,
  [CSS]: null,
  [HTML]: null,
};

/**
 * Processes the source from {language} to {language}, i.e. markdown to HTML
 * @param {String} source source code for a particular panel
 * @param {String} language enum of cm-modes
 * @param {String} target processor name
 * @returns {String} transformed language
 */
export async function process(source, language, target) {
  let res = source;

  if (targets[target]) {
    res = targets[target].transform(source);
  }

  last[language] = res;

  return res;
}

export function getChange(changed, bin, panel) {
  if (!last[panel]) {
    return process(bin[panel], panel, bin[panel + '-processor']);
  }

  return changed === panel
    ? process(bin[panel], panel, bin[panel + '-processor'])
    : last[panel];
}

/**
 *
 * @param {{ html: string, css: string, javascript: string }} bin - object must contain .html, .javascript and .css
 * @param {string} currentSource - enum of cm-modes
 * @returns {string} combined HTML
 */
export default async function transform(bin, currentSource) {
  return Promise.all([
    getChange(currentSource, bin, HTML),
    getChange(currentSource, bin, CSS),
    getChange(currentSource, bin, JAVASCRIPT),
  ]).then(([html, css, javascript]) => {
    return asHTML({
      html,
      css,
      javascript,
    });
  });
}

export function asHTML(bin) {
  let { html, css } = bin;
  const insertJS = html.includes('%code%');

  html = html.replace(/<script\s/g, '<script crossorigin="anonymous" ');

  // this logic will allow us to track whether there's an error, the
  // error is then passed through a localStorage event which is
  // paired back up using the guid
  let i = 0;
  const javascript = insertJS
    ? `
        try {
          ${bin.javascript}
        } catch (error) {
          try { localStorage.setItem('jsbin.error', JSON.stringify({
            name: error.name, message: error.message, stack: error.stack
          })); } catch (E) {}
          throw error;
        } //# sourceURL=your-scripts-${++i}.js$`
    : bin.javascript + `//# sourceURL=your-scripts-${i}.js$`;

  const result = binToHTML({
    html,
    javascript: insertJS ? javascript : '',
    css: bin.css,
  });

  return { result, html, insertJS, javascript, css };
}
