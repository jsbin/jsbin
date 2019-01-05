const reJS = /(?:<!--boot js-->\n?)?<script id="jsbin-javascript".*>([\s\S]+?)<\/script>\n*/;
const reCSS = /<style id="jsbin-css">\s([\s\S]+?)<\/style>\n?/;
const reProcessors = /<script id="jsbin-source-([a-z]+)?" type="text\/source-([a-z]+)">([\s\S]+?)<\/script>\n?/g;
const reMeta = new RegExp('<!-- jsbin -->.*<!-- /jsbin -->\\n', 'gm');

function fileToBin(html) {
  let javascript = '';
  let css = '';

  html = html.replace(reJS, (all, js) => {
    javascript = js.trim();
    return '';
  });

  html = html.replace(reCSS, (all, _css) => {
    css = _css.trim();
    return '';
  });

  // try to find bin url
  const [url, revision] = (html.match(/jsbin\.com\/(.+)\/edit/) || [
    null,
    '???/1',
  ])[1]
    .split('/');

  // start by stripping any out JS Bin specific metadata
  html = html.replace(reMeta, '');

  // check for processors
  const settings = {
    processors: {},
  };

  const source = {};

  const bin = {
    settings,
    url,
    source,
    revision: parseInt(revision, 10),
    javascript,
    css,
  };

  html = html.replace(reProcessors, (all, target, lang, code) => {
    settings.processors[target] = lang;
    bin.source[lang] = code;
    return '';
  });

  return { ...bin, html };
}

export default fileToBin;
