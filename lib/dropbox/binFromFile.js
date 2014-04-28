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
    panel: htmlMatches[2],
    type: htmlMatches[1]
  };
  if (html.type !== 'html') {
    settings.html = html.type;
  }

  var cssMatches = file.match(cssPanel);
  var css = {
    panel: cssMatches[2],
    type: cssMatches[1]
  };
  if (css.type !== 'css') {
    settings.css = css.type;
  }

  var jsMatches = file.match(jsPanel);
  var js = {
    panel: jsMatches[2],
    type: jsMatches[1]
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
