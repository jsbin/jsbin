'use strict';
module.exports = binFromFile;

function createPanelContentsRegExp (panel) {
  return new RegExp('<script id="jsbin-panel-' + panel + '" type="([\w]*)">([\s\S]*)<\/script>');
}

var htmlPanel = createPanelContentsRegExp('html');
var cssPanel = createPanelContentsRegExp('css');
var jsPanel = createPanelContentsRegExp('js');

function binFromFile(file) {
  var settings = {};

  var htmlMatches = file.match(htmlPanel);
  var html = {
    panel: htmlMatches[1],
    type: htmlMatches[0]
  };
  if (html.type !== 'html') {
    settings.html = html.type;
  }

  var cssMatches = file.match(cssPanel);
  var css = {
    panel: cssMatches[1],
    type: cssMatches[0]
  };
  if (css.type !== 'css') {
    settings.css = css.type;
  }

  var jsMatches = file.match(jsPanel);
  var js = {
    panel: jsMatches[1],
    type: jsMatches[0]
  };
  if (js.type !== 'javascript' || js.type !== 'js') {
    settings.javascript = js.type;
  }

  return {
    html: html.panel,
    css: css.panel,
    js: js.panel,
    settings: JSON.stringify(settings)
  };
}
