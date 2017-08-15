import makeIframe from './makeIFrame';
import { HTML, JAVASCRIPT, CSS } from './cm-modes';
import Haikunator from 'haikunator';
const slugger = new Haikunator({
  defaults: {
    // class defaults
    tokenLength: 3,
    tokenChars: 'ABCDEF0123456789',
  },
});

// via https://stackoverflow.com/a/6660315/22617
const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

/**
 * Pick the text content out of an element
 * @param {HTMLDocument} doc - the document element from an iframe
 * @param {String} selector - the querySelector
 * @param {String} defaultValue - the default value to return if not found
 * @param {String=} [from=innerText] - innerText or innerHTML
 */
function pick(doc, selector, defaultValue = '', from = 'innerText') {
  return (doc.querySelector(selector) || { [from]: defaultValue }).innerText;
}

export async function gist(bin, user) {
  let { id = slugger.haikunate(), html, javascript, css } = bin;

  let htmlNoJS = html;
  if (htmlNoJS.toLowerCase().includes('<script')) {
    htmlNoJS = htmlNoJS.replace(scriptRegex, '');
  }

  const iframe = makeIframe();
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  doc.open();
  doc.write(htmlNoJS);
  doc.close();

  const title = pick(doc, 'title', bin.title || 'JS Bin');
  const description = pick(doc, 'meta[name="description"', bin.description);
  document.body.removeChild(iframe); // clean up

  const headers = {
    accept: 'application/vnd.github.v3+json',
    'content-type': 'application/json',
  };

  if (user && user.githubToken) {
    headers.authorization = `token ${user.githubToken}`;
  }

  const res = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      description: title || description,
      public: false,
      files: {
        [id + '.html']: {
          content: html,
        },
        [id + '.js']: {
          content: javascript,
        },
        [id + '.css']: {
          content: css,
        },
      },
    }),
  });

  if (res.status > 201) {
    console.log('gist failed:' + res.status);
    return;
  }

  const json = await res.json();
  console.log(`gist: ${json.html_url}`);

  return json.id;
}

export function codepen(bin) {
  let { html, javascript, css } = bin;

  let htmlNoJS = html;
  if (htmlNoJS.toLowerCase().includes('<script')) {
    htmlNoJS = htmlNoJS.replace(scriptRegex, '');
  }

  const iframe = makeIframe();
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  doc.open();
  doc.write(htmlNoJS);
  doc.close();

  const title = pick(doc, 'title', bin.title || 'JS Bin');
  const description = pick(doc, 'meta[name="description"', bin.description);
  const tags = pick(doc, 'meta[name="keywords"', '')
    .split(',')
    .map(s => s.trim());

  const body = pick(doc, 'body', '', 'innerHTML');
  const head = pick(doc, 'head', '', 'innerHTML');
  const classNames = doc.documentElement.className;

  document.body.removeChild(iframe); // clean up

  const penOptions = {
    title,
    description,
    private: false,
    tags,
    html: body,
    html_classes: classNames,
    head,
    css,
    css_prefix: 'autoprefixer', // this should really be 'neither', but I'm being nice
    css_starter: 'neither',
    js: javascript,
    html_pre_processor: bin[`${HTML}-processor`],
    css_pre_processor: bin[`${CSS}-processor`],
    js_pre_processor: bin[`${JAVASCRIPT}-processor`],
  };

  // tidy up
  if (penOptions.html_pre_processor === 'html')
    penOptions.html_pre_processor = 'none';
  if (penOptions.css_pre_processor === 'css')
    penOptions.html_pre_processor = 'none';
  if (penOptions.js_pre_processor === 'javascript')
    penOptions.js_pre_processor = 'none';

  const form = document.createElement('form');
  form.method = 'post';
  form.action = 'https://codepen.io/pen/define';
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'data';
  input.value = JSON.stringify(penOptions);
  form.appendChild(input);
  form.target = '_blank';
  form.hidden = true;
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
