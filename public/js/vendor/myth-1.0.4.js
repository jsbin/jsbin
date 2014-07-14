!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.myth=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

var autoprefixer = _dereq_('autoprefixer');
var calc = _dereq_('rework-calc');
var color = _dereq_('rework-color-function');
var dirname = _dereq_('path').dirname;
var hex = _dereq_('rework-hex-alpha');
var inline = _dereq_('rework-inline');
var noop = function(){};
var rework = _dereq_('rework');
var variants = _dereq_('rework-font-variant');
var vars = _dereq_('rework-vars');

/**
 * Expose `myth`.
 */

module.exports = myth;

/**
 * Rework a CSS `string`, or return the Myth rework plugin.
 *
 * @param {String} string (optional)
 * @param {Object} options (optional)
 *   @property {String} source
 *   @property {Array} browsers
 *   @property {Boolean} compress
 * @return {String}
 */

function myth(string, options){
  if ('object' == typeof string) options = string, string = null;
  options = options || {};

  if ('string' != typeof string) return plugin(options);

  return rework(string, options)
    .use(plugin(options))
    .toString(options);
}

/**
 * Generate a Myth rework plugin with `options`.
 *
 * @param {Object} options
 * @return {Function}
 */

function plugin(options){
  return function(stylesheet, rework){
    var source = options.source;
    var browsers = options.browsers;
    var variables = vars();

    var prefixes = browsers
      ? autoprefixer().rework
      : autoprefixer(browsers).rework;

    var imports = 'undefined' == typeof window && source
      ? inline({ path: dirname(source) })
      : noop;

    rework
      .use(imports)
      .use(variables)
      .use(hex)
      .use(color)
      .use(calc)
      .use(variants)
      .use(prefixes);
  };
}

},{"autoprefixer":4,"path":60,"rework":101,"rework-calc":62,"rework-color-function":64,"rework-font-variant":75,"rework-hex-alpha":77,"rework-inline":79,"rework-vars":99}],2:[function(_dereq_,module,exports){
(function() {
  module.exports = {
    android: {
      prefix: "-webkit-",
      minor: true,
      future: [4.4],
      versions: [4.3, 4.2, 4.1, 4, 3, 2.3, 2.2, 2.1],
      popularity: [0.393833, 0.393833, 1.98513, 1.05377, 0.00532207, 1.3997, 0.0904751, 0.0266103]
    },
    bb: {
      prefix: "-webkit-",
      minor: true,
      versions: [10, 7],
      popularity: [0, 0.160821]
    },
    chrome: {
      prefix: "-webkit-",
      future: [33, 32],
      versions: [31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4],
      popularity: [14.7206, 15.7521, 0.631684, 0.415792, 0.335832, 0.391804, 0.263868, 0.175912, 0.191904, 0.231884, 0.47976, 0.03998, 0.03998, 0.095952, 0.031984, 0.047976, 0.071964, 0.055972, 0.055972, 0.063968, 0.111944, 0.03998, 0.023988, 0.031984, 0.023988, 0.031984, 0.023988, 0.023988]
    },
    ff: {
      prefix: "-moz-",
      future: [28, 27],
      versions: [26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3.6, 3.5, 3, 2],
      popularity: [0.415792, 9.51524, 2.47076, 0.295852, 0.1999, 0.191904, 0.143928, 0.11994, 0.095952, 0.191904, 0.23988, 0.135932, 0.087956, 0.087956, 0.191904, 0.087956, 0.103948, 0.055972, 0.063968, 0.03998, 0.047976, 0.03998, 0.063968, 0.311844, 0.03998, 0.087956, 0.015992]
    },
    ie: {
      prefix: "-ms-",
      versions: [11, 10, 9, 8, 7, 6, 5.5],
      popularity: [1.28176, 9.68717, 4.62585, 7.55911, 0.435471, 0.246493, 0.009298]
    },
    ios: {
      prefix: "-webkit-",
      versions: [7, 6.1, 6, 5.1, 5, 4.3, 4.2, 4.1, 4, 3.2],
      popularity: [2.91427, 0.517185, 0.517185, 0.154512, 0.154512, 0.015022, 0.015022, 0.004292, 0.004292, 0.004292]
    },
    opera: {
      prefix: "-o-",
      future: [18],
      versions: [17, 16, 15, 12.1, 12, 11.6, 11.5, 11.1, 11, 10.6, 10.5, 10.1, 10, 9.6, 9.5],
      popularity: [0.191904, 0.03998, 0.023988, 0.447776, 0.03998, 0.023988, 0.015992, 0.008219, 0.008219, 0.007996, 0.008392, 0.007996, 0.007996, 0.003998, 0.003998]
    },
    safari: {
      prefix: "-webkit-",
      versions: [7, 6.1, 6, 5.1, 5, 4, 3.2, 3.1],
      popularity: [0.751624, 0.583708, 0.943528, 1.0075, 0.295852, 0.111944, 0.008692, 0]
    }
  };

}).call(this);

},{}],3:[function(_dereq_,module,exports){
(function() {
  module.exports = {
    "::placeholder": {
      selector: true,
      browsers: ["android 4.4", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ie 10", "ie 11", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "::selection": {
      selector: true,
      browsers: ["ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28"]
    },
    ":fullscreen": {
      selector: true,
      browsers: ["chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ie 11", "opera 15", "opera 16", "opera 17", "opera 18", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "@keyframes": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "align-content": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4 2009", "chrome 5 2009", "chrome 6 2009", "chrome 7 2009", "chrome 8 2009", "chrome 9 2009", "chrome 10 2009", "chrome 11 2009", "chrome 12 2009", "chrome 13 2009", "chrome 14 2009", "chrome 15 2009", "chrome 16 2009", "chrome 17 2009", "chrome 18 2009", "chrome 19 2009", "chrome 20 2009", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ie 10", "ios 3.2 2009", "ios 4 2009", "ios 4.1 2009", "ios 4.2 2009", "ios 4.3 2009", "ios 5 2009", "ios 5.1 2009", "ios 6 2009", "ios 6.1 2009", "ios 7", "opera 15", "opera 16", "safari 3.1 2009", "safari 3.2 2009", "safari 4 2009", "safari 5 2009", "safari 5.1 2009", "safari 6 2009", "safari 6.1 2009", "safari 7"]
    },
    "align-items": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4 2009", "chrome 5 2009", "chrome 6 2009", "chrome 7 2009", "chrome 8 2009", "chrome 9 2009", "chrome 10 2009", "chrome 11 2009", "chrome 12 2009", "chrome 13 2009", "chrome 14 2009", "chrome 15 2009", "chrome 16 2009", "chrome 17 2009", "chrome 18 2009", "chrome 19 2009", "chrome 20 2009", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ie 10", "ios 3.2 2009", "ios 4 2009", "ios 4.1 2009", "ios 4.2 2009", "ios 4.3 2009", "ios 5 2009", "ios 5.1 2009", "ios 6 2009", "ios 6.1 2009", "ios 7", "opera 15", "opera 16", "safari 3.1 2009", "safari 3.2 2009", "safari 4 2009", "safari 5 2009", "safari 5.1 2009", "safari 6 2009", "safari 6.1 2009", "safari 7"]
    },
    "align-self": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4 2009", "chrome 5 2009", "chrome 6 2009", "chrome 7 2009", "chrome 8 2009", "chrome 9 2009", "chrome 10 2009", "chrome 11 2009", "chrome 12 2009", "chrome 13 2009", "chrome 14 2009", "chrome 15 2009", "chrome 16 2009", "chrome 17 2009", "chrome 18 2009", "chrome 19 2009", "chrome 20 2009", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ie 10", "ios 3.2 2009", "ios 4 2009", "ios 4.1 2009", "ios 4.2 2009", "ios 4.3 2009", "ios 5 2009", "ios 5.1 2009", "ios 6 2009", "ios 6.1 2009", "ios 7", "opera 15", "opera 16", "safari 3.1 2009", "safari 3.2 2009", "safari 4 2009", "safari 5 2009", "safari 5.1 2009", "safari 6 2009", "safari 6.1 2009", "safari 7"]
    },
    animation: {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "animation-delay": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "animation-direction": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "animation-duration": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "animation-fill-mode": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "animation-iteration-count": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "animation-name": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "animation-play-state": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "animation-timing-function": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "backface-visibility": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ie 9", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 10.5", "opera 10.6", "opera 11", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "background-clip": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "ff 3.6", "opera 10", "opera 10.1"]
    },
    "background-origin": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "ff 3.6", "opera 10", "opera 10.1"]
    },
    "background-size": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "ff 3.6", "opera 10", "opera 10.1"]
    },
    "border-bottom-left-radius": {
      mistakes: ["-ms-"],
      browsers: ["android 2.1", "chrome 4", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ios 3.2", "safari 3.1", "safari 3.2", "safari 4"],
      transition: true
    },
    "border-bottom-right-radius": {
      mistakes: ["-ms-"],
      browsers: ["android 2.1", "chrome 4", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ios 3.2", "safari 3.1", "safari 3.2", "safari 4"],
      transition: true
    },
    "border-image": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "opera 11", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "opera 12.1", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1"]
    },
    "border-radius": {
      mistakes: ["-ms-"],
      browsers: ["android 2.1", "chrome 4", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ios 3.2", "safari 3.1", "safari 3.2", "safari 4"],
      transition: true
    },
    "border-top-left-radius": {
      mistakes: ["-ms-"],
      browsers: ["android 2.1", "chrome 4", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ios 3.2", "safari 3.1", "safari 3.2", "safari 4"],
      transition: true
    },
    "border-top-right-radius": {
      mistakes: ["-ms-"],
      browsers: ["android 2.1", "chrome 4", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ios 3.2", "safari 3.1", "safari 3.2", "safari 4"],
      transition: true
    },
    "box-shadow": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "bb 7", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "ff 3.5", "ff 3.6", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "safari 3.1", "safari 3.2", "safari 4", "safari 5"],
      transition: true
    },
    "box-sizing": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "bb 7", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "safari 3.1", "safari 3.2", "safari 4", "safari 5"]
    },
    "break-after": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "break-before": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "break-inside": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    calc: {
      props: ["*"],
      browsers: ["bb 10", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 6", "ios 6.1", "safari 6"]
    },
    "column-count": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "column-fill": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "column-gap": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"],
      transition: true
    },
    "column-rule": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"],
      transition: true
    },
    "column-rule-color": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"],
      transition: true
    },
    "column-rule-style": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "column-rule-width": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"],
      transition: true
    },
    "column-span": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "column-width": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"],
      transition: true
    },
    columns: {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"],
      transition: true
    },
    "display-flex": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4 2009", "chrome 5 2009", "chrome 6 2009", "chrome 7 2009", "chrome 8 2009", "chrome 9 2009", "chrome 10 2009", "chrome 11 2009", "chrome 12 2009", "chrome 13 2009", "chrome 14 2009", "chrome 15 2009", "chrome 16 2009", "chrome 17 2009", "chrome 18 2009", "chrome 19 2009", "chrome 20 2009", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ie 10", "ios 3.2 2009", "ios 4 2009", "ios 4.1 2009", "ios 4.2 2009", "ios 4.3 2009", "ios 5 2009", "ios 5.1 2009", "ios 6 2009", "ios 6.1 2009", "ios 7", "opera 15", "opera 16", "safari 3.1 2009", "safari 3.2 2009", "safari 4 2009", "safari 5 2009", "safari 5.1 2009", "safari 6 2009", "safari 6.1 2009", "safari 7"]
    },
    "fill-available": {
      props: ["width", "min-width", "max-width", "height", "min-height", "max-height"],
      browsers: ["android 4.4", "bb 10", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 6.1", "safari 7"]
    },
    filter: {
      browsers: ["android 4.4", "bb 10", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 6", "safari 6.1", "safari 7"],
      transition: true
    },
    "fit-content": {
      props: ["width", "min-width", "max-width", "height", "min-height", "max-height"],
      browsers: ["android 4.4", "bb 10", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 6.1", "safari 7"]
    },
    flex: {
      transition: true,
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4 2009", "chrome 5 2009", "chrome 6 2009", "chrome 7 2009", "chrome 8 2009", "chrome 9 2009", "chrome 10 2009", "chrome 11 2009", "chrome 12 2009", "chrome 13 2009", "chrome 14 2009", "chrome 15 2009", "chrome 16 2009", "chrome 17 2009", "chrome 18 2009", "chrome 19 2009", "chrome 20 2009", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ie 10", "ios 3.2 2009", "ios 4 2009", "ios 4.1 2009", "ios 4.2 2009", "ios 4.3 2009", "ios 5 2009", "ios 5.1 2009", "ios 6 2009", "ios 6.1 2009", "ios 7", "opera 15", "opera 16", "safari 3.1 2009", "safari 3.2 2009", "safari 4 2009", "safari 5 2009", "safari 5.1 2009", "safari 6 2009", "safari 6.1 2009", "safari 7"]
    },
    "flex-basis": {
      transition: true,
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4 2009", "chrome 5 2009", "chrome 6 2009", "chrome 7 2009", "chrome 8 2009", "chrome 9 2009", "chrome 10 2009", "chrome 11 2009", "chrome 12 2009", "chrome 13 2009", "chrome 14 2009", "chrome 15 2009", "chrome 16 2009", "chrome 17 2009", "chrome 18 2009", "chrome 19 2009", "chrome 20 2009", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ie 10", "ios 3.2 2009", "ios 4 2009", "ios 4.1 2009", "ios 4.2 2009", "ios 4.3 2009", "ios 5 2009", "ios 5.1 2009", "ios 6 2009", "ios 6.1 2009", "ios 7", "opera 15", "opera 16", "safari 3.1 2009", "safari 3.2 2009", "safari 4 2009", "safari 5 2009", "safari 5.1 2009", "safari 6 2009", "safari 6.1 2009", "safari 7"]
    },
    "flex-direction": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4 2009", "chrome 5 2009", "chrome 6 2009", "chrome 7 2009", "chrome 8 2009", "chrome 9 2009", "chrome 10 2009", "chrome 11 2009", "chrome 12 2009", "chrome 13 2009", "chrome 14 2009", "chrome 15 2009", "chrome 16 2009", "chrome 17 2009", "chrome 18 2009", "chrome 19 2009", "chrome 20 2009", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ie 10", "ios 3.2 2009", "ios 4 2009", "ios 4.1 2009", "ios 4.2 2009", "ios 4.3 2009", "ios 5 2009", "ios 5.1 2009", "ios 6 2009", "ios 6.1 2009", "ios 7", "opera 15", "opera 16", "safari 3.1 2009", "safari 3.2 2009", "safari 4 2009", "safari 5 2009", "safari 5.1 2009", "safari 6 2009", "safari 6.1 2009", "safari 7"]
    },
    "flex-flow": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4 2009", "chrome 5 2009", "chrome 6 2009", "chrome 7 2009", "chrome 8 2009", "chrome 9 2009", "chrome 10 2009", "chrome 11 2009", "chrome 12 2009", "chrome 13 2009", "chrome 14 2009", "chrome 15 2009", "chrome 16 2009", "chrome 17 2009", "chrome 18 2009", "chrome 19 2009", "chrome 20 2009", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ie 10", "ios 3.2 2009", "ios 4 2009", "ios 4.1 2009", "ios 4.2 2009", "ios 4.3 2009", "ios 5 2009", "ios 5.1 2009", "ios 6 2009", "ios 6.1 2009", "ios 7", "opera 15", "opera 16", "safari 3.1 2009", "safari 3.2 2009", "safari 4 2009", "safari 5 2009", "safari 5.1 2009", "safari 6 2009", "safari 6.1 2009", "safari 7"]
    },
    "flex-grow": {
      transition: true,
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4 2009", "chrome 5 2009", "chrome 6 2009", "chrome 7 2009", "chrome 8 2009", "chrome 9 2009", "chrome 10 2009", "chrome 11 2009", "chrome 12 2009", "chrome 13 2009", "chrome 14 2009", "chrome 15 2009", "chrome 16 2009", "chrome 17 2009", "chrome 18 2009", "chrome 19 2009", "chrome 20 2009", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ie 10", "ios 3.2 2009", "ios 4 2009", "ios 4.1 2009", "ios 4.2 2009", "ios 4.3 2009", "ios 5 2009", "ios 5.1 2009", "ios 6 2009", "ios 6.1 2009", "ios 7", "opera 15", "opera 16", "safari 3.1 2009", "safari 3.2 2009", "safari 4 2009", "safari 5 2009", "safari 5.1 2009", "safari 6 2009", "safari 6.1 2009", "safari 7"]
    },
    "flex-shrink": {
      transition: true,
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4 2009", "chrome 5 2009", "chrome 6 2009", "chrome 7 2009", "chrome 8 2009", "chrome 9 2009", "chrome 10 2009", "chrome 11 2009", "chrome 12 2009", "chrome 13 2009", "chrome 14 2009", "chrome 15 2009", "chrome 16 2009", "chrome 17 2009", "chrome 18 2009", "chrome 19 2009", "chrome 20 2009", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ie 10", "ios 3.2 2009", "ios 4 2009", "ios 4.1 2009", "ios 4.2 2009", "ios 4.3 2009", "ios 5 2009", "ios 5.1 2009", "ios 6 2009", "ios 6.1 2009", "ios 7", "opera 15", "opera 16", "safari 3.1 2009", "safari 3.2 2009", "safari 4 2009", "safari 5 2009", "safari 5.1 2009", "safari 6 2009", "safari 6.1 2009", "safari 7"]
    },
    "flex-wrap": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4 2009", "chrome 5 2009", "chrome 6 2009", "chrome 7 2009", "chrome 8 2009", "chrome 9 2009", "chrome 10 2009", "chrome 11 2009", "chrome 12 2009", "chrome 13 2009", "chrome 14 2009", "chrome 15 2009", "chrome 16 2009", "chrome 17 2009", "chrome 18 2009", "chrome 19 2009", "chrome 20 2009", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ie 10", "ios 3.2 2009", "ios 4 2009", "ios 4.1 2009", "ios 4.2 2009", "ios 4.3 2009", "ios 5 2009", "ios 5.1 2009", "ios 6 2009", "ios 6.1 2009", "ios 7", "opera 15", "opera 16", "safari 3.1 2009", "safari 3.2 2009", "safari 4 2009", "safari 5 2009", "safari 5.1 2009", "safari 6 2009", "safari 6.1 2009", "safari 7"]
    },
    "font-feature-settings": {
      browsers: ["android 4.4", "bb 10", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 6.1", "safari 7"]
    },
    "font-kerning": {
      browsers: ["android 4.4", "bb 10", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 6.1", "safari 7"]
    },
    "font-language-override": {
      browsers: ["android 4.4", "bb 10", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 6.1", "safari 7"]
    },
    "font-variant-ligatures": {
      browsers: ["android 4.4", "bb 10", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 6.1", "safari 7"]
    },
    grab: {
      props: ["cursor"],
      browsers: ["chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    grabbing: {
      props: ["cursor"],
      browsers: ["chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    hyphens: {
      browsers: ["ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ie 10", "ie 11", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "justify-content": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4 2009", "chrome 5 2009", "chrome 6 2009", "chrome 7 2009", "chrome 8 2009", "chrome 9 2009", "chrome 10 2009", "chrome 11 2009", "chrome 12 2009", "chrome 13 2009", "chrome 14 2009", "chrome 15 2009", "chrome 16 2009", "chrome 17 2009", "chrome 18 2009", "chrome 19 2009", "chrome 20 2009", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ie 10", "ios 3.2 2009", "ios 4 2009", "ios 4.1 2009", "ios 4.2 2009", "ios 4.3 2009", "ios 5 2009", "ios 5.1 2009", "ios 6 2009", "ios 6.1 2009", "ios 7", "opera 15", "opera 16", "safari 3.1 2009", "safari 3.2 2009", "safari 4 2009", "safari 5 2009", "safari 5.1 2009", "safari 6 2009", "safari 6.1 2009", "safari 7"]
    },
    "linear-gradient": {
      props: ["background", "background-image", "border-image"],
      mistakes: ["-ms-"],
      browsers: ["android 2.1 old", "android 2.2 old", "android 2.3 old", "android 3 old", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2 old", "ios 4 old", "ios 4.1 old", "ios 4.2 old", "ios 4.3 old", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "safari 4 old", "safari 5 old", "safari 5.1", "safari 6"]
    },
    "max-content": {
      props: ["width", "min-width", "max-width", "height", "min-height", "max-height"],
      browsers: ["android 4.4", "bb 10", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 6.1", "safari 7"]
    },
    "min-content": {
      props: ["width", "min-width", "max-width", "height", "min-height", "max-height"],
      browsers: ["android 4.4", "bb 10", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 6.1", "safari 7"]
    },
    order: {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4 2009", "chrome 5 2009", "chrome 6 2009", "chrome 7 2009", "chrome 8 2009", "chrome 9 2009", "chrome 10 2009", "chrome 11 2009", "chrome 12 2009", "chrome 13 2009", "chrome 14 2009", "chrome 15 2009", "chrome 16 2009", "chrome 17 2009", "chrome 18 2009", "chrome 19 2009", "chrome 20 2009", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ie 10", "ios 3.2 2009", "ios 4 2009", "ios 4.1 2009", "ios 4.2 2009", "ios 4.3 2009", "ios 5 2009", "ios 5.1 2009", "ios 6 2009", "ios 6.1 2009", "ios 7", "opera 15", "opera 16", "safari 3.1 2009", "safari 3.2 2009", "safari 4 2009", "safari 5 2009", "safari 5.1 2009", "safari 6 2009", "safari 6.1 2009", "safari 7"]
    },
    perspective: {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ie 9", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 10.5", "opera 10.6", "opera 11", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"],
      transition: true
    },
    "perspective-origin": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ie 9", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 10.5", "opera 10.6", "opera 11", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"],
      transition: true
    },
    "radial-gradient": {
      props: ["background", "background-image", "border-image"],
      mistakes: ["-ms-"],
      browsers: ["android 2.1 old", "android 2.2 old", "android 2.3 old", "android 3 old", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2 old", "ios 4 old", "ios 4.1 old", "ios 4.2 old", "ios 4.3 old", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "safari 4 old", "safari 5 old", "safari 5.1", "safari 6"]
    },
    "repeating-linear-gradient": {
      props: ["background", "background-image", "border-image"],
      mistakes: ["-ms-"],
      browsers: ["android 2.1 old", "android 2.2 old", "android 2.3 old", "android 3 old", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2 old", "ios 4 old", "ios 4.1 old", "ios 4.2 old", "ios 4.3 old", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "safari 4 old", "safari 5 old", "safari 5.1", "safari 6"]
    },
    "repeating-radial-gradient": {
      props: ["background", "background-image", "border-image"],
      mistakes: ["-ms-"],
      browsers: ["android 2.1 old", "android 2.2 old", "android 2.3 old", "android 3 old", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2 old", "ios 4 old", "ios 4.1 old", "ios 4.2 old", "ios 4.3 old", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "safari 4 old", "safari 5 old", "safari 5.1", "safari 6"]
    },
    "tab-size": {
      browsers: ["ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "opera 10.6", "opera 11", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "opera 12.1"]
    },
    transform: {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ie 9", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 10.5", "opera 10.6", "opera 11", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"],
      transition: true
    },
    "transform-origin": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ie 9", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 10.5", "opera 10.6", "opera 11", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"],
      transition: true
    },
    "transform-style": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ie 9", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 10.5", "opera 10.6", "opera 11", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    transition: {
      mistakes: ["-ms-"],
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "opera 10.5", "opera 10.6", "opera 11", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6"]
    },
    "transition-delay": {
      mistakes: ["-ms-"],
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "opera 10.5", "opera 10.6", "opera 11", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6"]
    },
    "transition-duration": {
      mistakes: ["-ms-"],
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "opera 10.5", "opera 10.6", "opera 11", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6"]
    },
    "transition-property": {
      mistakes: ["-ms-"],
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "opera 10.5", "opera 10.6", "opera 11", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6"]
    },
    "transition-timing-function": {
      mistakes: ["-ms-"],
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "bb 7", "bb 10", "chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "opera 10.5", "opera 10.6", "opera 11", "opera 11.1", "opera 11.5", "opera 11.6", "opera 12", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6"]
    },
    "user-select": {
      browsers: ["android 2.1", "android 2.2", "android 2.3", "android 3", "android 4", "android 4.1", "android 4.2", "android 4.3", "android 4.4", "bb 7", "bb 10", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "ff 24", "ff 25", "ff 26", "ff 27", "ff 28", "ie 10", "ie 11", "ios 3.2", "ios 4", "ios 4.1", "ios 4.2", "ios 4.3", "ios 5", "ios 5.1", "ios 6", "ios 6.1", "ios 7", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "zoom-in": {
      props: ["cursor"],
      browsers: ["chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    },
    "zoom-out": {
      props: ["cursor"],
      browsers: ["chrome 4", "chrome 5", "chrome 6", "chrome 7", "chrome 8", "chrome 9", "chrome 10", "chrome 11", "chrome 12", "chrome 13", "chrome 14", "chrome 15", "chrome 16", "chrome 17", "chrome 18", "chrome 19", "chrome 20", "chrome 21", "chrome 22", "chrome 23", "chrome 24", "chrome 25", "chrome 26", "chrome 27", "chrome 28", "chrome 29", "chrome 30", "chrome 31", "chrome 32", "chrome 33", "ff 2", "ff 3", "ff 3.5", "ff 3.6", "ff 4", "ff 5", "ff 6", "ff 7", "ff 8", "ff 9", "ff 10", "ff 11", "ff 12", "ff 13", "ff 14", "ff 15", "ff 16", "ff 17", "ff 18", "ff 19", "ff 20", "ff 21", "ff 22", "ff 23", "opera 15", "opera 16", "opera 17", "opera 18", "safari 3.1", "safari 3.2", "safari 4", "safari 5", "safari 5.1", "safari 6", "safari 6.1", "safari 7"]
    }
  };

}).call(this);

},{}],4:[function(_dereq_,module,exports){
(function() {
  var Autoprefixer, Browsers, CSS, Prefixes, autoprefixer, inspectCache, parse, stringify,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  parse = _dereq_('css-parse');

  stringify = _dereq_('css-stringify');

  Browsers = _dereq_('./autoprefixer/browsers');

  Prefixes = _dereq_('./autoprefixer/prefixes');

  CSS = _dereq_('./autoprefixer/css');

  inspectCache = null;

  autoprefixer = function() {
    var browsers, prefixes, reqs;
    reqs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (reqs.length === 1 && reqs[0] instanceof Array) {
      reqs = reqs[0];
    } else if (reqs.length === 0 || (reqs.length === 1 && (reqs[0] == null))) {
      reqs = void 0;
    }
    if (reqs == null) {
      reqs = autoprefixer["default"];
    }
    browsers = new Browsers(autoprefixer.data.browsers, reqs);
    prefixes = new Prefixes(autoprefixer.data.prefixes, browsers);
    return new Autoprefixer(prefixes, autoprefixer.data);
  };

  autoprefixer.data = {
    browsers: _dereq_('../data/browsers'),
    prefixes: _dereq_('../data/prefixes')
  };

  Autoprefixer = (function() {
    function Autoprefixer(prefixes, data) {
      this.prefixes = prefixes;
      this.data = data;
      this.rework = __bind(this.rework, this);
      this.browsers = this.prefixes.browsers.selected;
    }

    Autoprefixer.prototype.compile = function(str) {
      var nodes,
        _this = this;
      nodes = this.catchParseErrors(function() {
        return parse(_this.removeBadComments(str));
      });
      this.rework(nodes.stylesheet);
      return stringify(nodes);
    };

    Autoprefixer.prototype.rework = function(stylesheet) {
      var css;
      css = new CSS(stylesheet);
      this.prefixes.processor.add(css);
      return this.prefixes.processor.remove(css);
    };

    Autoprefixer.prototype.inspect = function() {
      inspectCache || (inspectCache = _dereq_('./autoprefixer/inspect'));
      return inspectCache(this.prefixes);
    };

    Autoprefixer.prototype.catchParseErrors = function(callback) {
      var e, error;
      try {
        return callback();
      } catch (_error) {
        e = _error;
        error = new Error("Can't parse CSS: " + e.message);
        error.stack = e.stack;
        error.css = true;
        throw error;
      }
    };

    Autoprefixer.prototype.removeBadComments = function(css) {
      return css.replace(/\/\*[^\*]*\}[^\*]*\*\//g, '');
    };

    return Autoprefixer;

  })();

  autoprefixer["default"] = ['> 1%', 'last 2 versions', 'ff 24', 'opera 12.1'];

  autoprefixer.loadDefault = function() {
    return this.defaultCache || (this.defaultCache = autoprefixer(this["default"]));
  };

  autoprefixer.compile = function(str) {
    return this.loadDefault().compile(str);
  };

  autoprefixer.rework = function(stylesheet) {
    return this.loadDefault().rework(stylesheet);
  };

  autoprefixer.inspect = function() {
    return this.loadDefault().inspect();
  };

  module.exports = autoprefixer;

}).call(this);

},{"../data/browsers":2,"../data/prefixes":3,"./autoprefixer/browsers":5,"./autoprefixer/css":6,"./autoprefixer/inspect":30,"./autoprefixer/prefixes":33,"css-parse":40,"css-stringify":41}],5:[function(_dereq_,module,exports){
(function() {
  var Browsers, utils;

  utils = _dereq_('./utils');

  Browsers = (function() {
    function Browsers(data, requirements) {
      this.data = data;
      this.selected = this.parse(requirements);
    }

    Browsers.prototype.parse = function(requirements) {
      var selected,
        _this = this;
      if (!(requirements instanceof Array)) {
        requirements = [requirements];
      }
      selected = [];
      requirements.map(function(req) {
        var i, match, name, _ref;
        _ref = _this.requirements;
        for (name in _ref) {
          i = _ref[name];
          if (match = req.match(i.regexp)) {
            selected = selected.concat(i.select.apply(_this, match.slice(1)));
            return;
          }
        }
        return utils.error("Unknown browser requirement `" + req + "`");
      });
      return utils.uniq(selected);
    };

    Browsers.prototype.aliases = {
      fx: 'ff'
    };

    Browsers.prototype.requirements = {
      none: {
        regexp: /^none$/i,
        select: function() {
          return [];
        }
      },
      lastVersions: {
        regexp: /^last (\d+) versions?$/i,
        select: function(versions) {
          return this.browsers(function(data) {
            if (data.minor) {
              return [];
            } else {
              return data.versions.slice(0, versions);
            }
          });
        }
      },
      globalStatistics: {
        regexp: /^> (\d+(\.\d+)?)%$/,
        select: function(popularity) {
          return this.browsers(function(data) {
            return data.versions.filter(function(version, i) {
              return data.popularity[i] > popularity;
            });
          });
        }
      },
      newerThen: {
        regexp: /^(\w+) (>=?)\s*([\d\.]+)/,
        select: function(browser, sign, version) {
          var data, filter;
          browser = this.aliases[browser] || browser;
          data = this.data[browser];
          version = parseFloat(version);
          if (!data) {
            utils.error("Unknown browser " + browser);
          }
          if (sign === '>') {
            filter = function(v) {
              return v > version;
            };
          } else if (sign === '>=') {
            filter = function(v) {
              return v >= version;
            };
          }
          return data.versions.filter(filter).map(function(v) {
            return "" + browser + " " + v;
          });
        }
      },
      direct: {
        regexp: /^(\w+) ([\d\.]+)$/,
        select: function(browser, version) {
          var data, first, last;
          browser = this.aliases[browser] || browser;
          data = this.data[browser];
          version = parseFloat(version);
          if (!data) {
            utils.error("Unknown browser " + browser);
          }
          last = data.future ? data.future[0] : data.versions[0];
          first = data.versions[data.versions.length - 1];
          if (version > last) {
            version = last;
          } else if (version < first) {
            version = first;
          }
          return ["" + browser + " " + version];
        }
      }
    };

    Browsers.prototype.browsers = function(criteria) {
      var browser, data, selected, versions, _ref;
      selected = [];
      _ref = this.data;
      for (browser in _ref) {
        data = _ref[browser];
        versions = criteria(data).map(function(version) {
          return "" + browser + " " + version;
        });
        selected = selected.concat(versions);
      }
      return selected;
    };

    Browsers.prototype.prefixes = function() {
      var i, name;
      return this.prefixesCache || (this.prefixesCache = utils.uniq((function() {
        var _ref, _results;
        _ref = this.data;
        _results = [];
        for (name in _ref) {
          i = _ref[name];
          _results.push(i.prefix);
        }
        return _results;
      }).call(this)).sort(function(a, b) {
        return b.length - a.length;
      }));
    };

    Browsers.prototype.prefix = function(browser) {
      var name, version, _ref;
      _ref = browser.split(' '), name = _ref[0], version = _ref[1];
      if (name === 'opera' && parseFloat(version) >= 15) {
        return '-webkit-';
      } else {
        return this.data[name].prefix;
      }
    };

    Browsers.prototype.isSelected = function(browser) {
      return this.selected.indexOf(browser) !== -1;
    };

    return Browsers;

  })();

  module.exports = Browsers;

}).call(this);

},{"./utils":38}],6:[function(_dereq_,module,exports){
(function() {
  var CSS, Declaration, Keyframes, Rules;

  Rules = _dereq_('./rules');

  Keyframes = _dereq_('./keyframes');

  Declaration = _dereq_('./declaration');

  CSS = (function() {
    function CSS(stylesheet) {
      this.stylesheet = stylesheet;
    }

    CSS.prototype.eachKeyframes = function(callback) {
      var rule;
      this.number = 0;
      while (this.number < this.stylesheet.rules.length) {
        rule = this.stylesheet.rules[this.number];
        if (rule.keyframes) {
          callback(new Keyframes(this, this.number, rule));
        }
        this.number += 1;
      }
      return false;
    };

    CSS.prototype.containKeyframes = function(rule) {
      return this.stylesheet.rules.some(function(i) {
        return i.keyframes && i.name === rule.name && i.vendor === rule.vendor;
      });
    };

    CSS.prototype.addKeyframes = function(position, rule) {
      if (this.containKeyframes(rule)) {
        return;
      }
      this.stylesheet.rules.splice(position, 0, rule);
      return this.number += 1;
    };

    CSS.prototype.removeKeyframes = function(position) {
      this.stylesheet.rules.splice(position, 1);
      return this.number -= 1;
    };

    CSS.prototype.eachRule = function(callback) {
      return Rules.each(this.stylesheet.rules, callback);
    };

    CSS.prototype.eachDeclaration = function(callback) {
      return this.eachRule(function(rule) {
        return rule.each(callback);
      });
    };

    return CSS;

  })();

  module.exports = CSS;

}).call(this);

},{"./declaration":7,"./keyframes":31,"./rules":36}],7:[function(_dereq_,module,exports){
(function() {
  var Declaration, utils;

  utils = _dereq_('./utils');

  Declaration = (function() {
    Declaration.register = function(klass) {
      var name, _i, _len, _ref, _results;
      _ref = klass.names;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        _results.push(this.hacks[name] = klass);
      }
      return _results;
    };

    Declaration.hacks = {};

    Declaration.load = function(rule, number, node) {
      var klass, prefix, unprefixed, _ref;
      _ref = this.split(node.property), prefix = _ref[0], unprefixed = _ref[1];
      klass = this.hacks[unprefixed];
      if (klass) {
        return new klass(rule, number, node, prefix, unprefixed);
      } else {
        return new Declaration(rule, number, node, prefix, unprefixed);
      }
    };

    Declaration.split = function(prop) {
      var prefix, separator, unprefixed;
      if (prop[0] === '-') {
        separator = prop.indexOf('-', 1) + 1;
        prefix = prop.slice(0, separator);
        unprefixed = prop.slice(separator);
        return [prefix, unprefixed];
      } else {
        return ['', prop];
      }
    };

    function Declaration(rule, number, node, prefix, unprefixed) {
      this.rule = rule;
      this.number = number;
      this.node = node;
      this.prefix = prefix;
      this.unprefixed = unprefixed;
      this.prop = this.node.property;
      this.value = this.node.value;
      this.valuesCache = {};
    }

    Declaration.prototype.valueContain = function(strings) {
      var _this = this;
      return strings.some(function(i) {
        return _this.value.indexOf(i) !== -1;
      });
    };

    Declaration.prototype.prefixProp = function(prefix, value) {
      if (value == null) {
        value = this.value;
      }
      if (this.rule.contain(prefix + this.unprefixed)) {
        return;
      }
      return this.insertBefore(prefix + this.unprefixed, value);
    };

    Declaration.prototype.insertBefore = function(prop, value) {
      var clone;
      if (this.rule.contain(prop, value)) {
        return;
      }
      clone = utils.clone(this.node, {
        property: prop,
        value: value
      });
      this.rule.add(this.number, clone);
      return this.number += 1;
    };

    Declaration.prototype.remove = function() {
      return this.rule.removeDecl(this.number);
    };

    Declaration.prototype.prefixValue = function(prefix, value) {
      var val;
      val = this.valuesCache[prefix] || this.value;
      return this.valuesCache[prefix] = value.addPrefix(prefix, val);
    };

    Declaration.prototype.setValue = function(value) {
      return this.value = this.node.value = value;
    };

    Declaration.prototype.saveValues = function() {
      var prefix, value, vendor, _ref, _results;
      _ref = this.valuesCache;
      _results = [];
      for (prefix in _ref) {
        value = _ref[prefix];
        vendor = utils.removeNote(prefix);
        if (this.rule.prefix && vendor !== this.rule.prefix) {
          continue;
        }
        if (vendor === this.prefix) {
          _results.push(this.setValue(value));
        } else if (!this.rule.byProp(vendor + this.unprefixed)) {
          _results.push(this.insertBefore(this.prop, value));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    return Declaration;

  })();

  module.exports = Declaration;

}).call(this);

},{"./utils":38}],8:[function(_dereq_,module,exports){
(function() {
  var AlignContent, FlexDeclaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = _dereq_('./flex-declaration');

  AlignContent = (function(_super) {
    __extends(AlignContent, _super);

    AlignContent.names = ['align-content', 'flex-line-pack'];

    AlignContent.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start',
      'space-between': 'justify',
      'space-around': 'distribute'
    };

    function AlignContent() {
      AlignContent.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'align-content';
      this.prop = this.prefix + this.unprefixed;
    }

    AlignContent.prototype.prefixProp = function(prefix) {
      var oldValue, spec, _ref;
      _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === '2012') {
        oldValue = AlignContent.oldValues[this.value] || this.value;
        return this.insertBefore(prefix + 'flex-line-pack', oldValue);
      } else if (spec === 'final') {
        return AlignContent.__super__.prefixProp.apply(this, arguments);
      }
    };

    return AlignContent;

  })(FlexDeclaration);

  module.exports = AlignContent;

}).call(this);

},{"./flex-declaration":17}],9:[function(_dereq_,module,exports){
(function() {
  var AlignItems, FlexDeclaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = _dereq_('./flex-declaration');

  AlignItems = (function(_super) {
    __extends(AlignItems, _super);

    AlignItems.names = ['align-items', 'flex-align', 'box-align'];

    AlignItems.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start'
    };

    function AlignItems() {
      AlignItems.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'align-items';
      this.prop = this.prefix + this.unprefixed;
    }

    AlignItems.prototype.prefixProp = function(prefix) {
      var oldValue, spec, _ref;
      _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      oldValue = AlignItems.oldValues[this.value] || this.value;
      if (spec === '2009') {
        return this.insertBefore(prefix + 'box-align', oldValue);
      } else if (spec === '2012') {
        return this.insertBefore(prefix + 'flex-align', oldValue);
      } else if (spec === 'final') {
        return AlignItems.__super__.prefixProp.apply(this, arguments);
      }
    };

    return AlignItems;

  })(FlexDeclaration);

  module.exports = AlignItems;

}).call(this);

},{"./flex-declaration":17}],10:[function(_dereq_,module,exports){
(function() {
  var AlignSelf, FlexDeclaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = _dereq_('./flex-declaration');

  AlignSelf = (function(_super) {
    __extends(AlignSelf, _super);

    AlignSelf.names = ['align-self', 'flex-item-align'];

    AlignSelf.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start'
    };

    function AlignSelf() {
      AlignSelf.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'align-self';
      this.prop = this.prefix + this.unprefixed;
    }

    AlignSelf.prototype.prefixProp = function(prefix) {
      var oldValue, spec, _ref;
      _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === '2012') {
        oldValue = AlignSelf.oldValues[this.value] || this.value;
        return this.insertBefore(prefix + 'flex-item-align', oldValue);
      } else if (spec === 'final') {
        return AlignSelf.__super__.prefixProp.apply(this, arguments);
      }
    };

    return AlignSelf;

  })(FlexDeclaration);

  module.exports = AlignSelf;

}).call(this);

},{"./flex-declaration":17}],11:[function(_dereq_,module,exports){
(function() {
  var BorderImage, Declaration, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = _dereq_('../declaration');

  BorderImage = (function(_super) {
    __extends(BorderImage, _super);

    function BorderImage() {
      _ref = BorderImage.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BorderImage.names = ['border-image'];

    BorderImage.prototype.prefixProp = function(prefix) {
      return BorderImage.__super__.prefixProp.call(this, prefix, this.value.replace(/\s+fill(\s)/, '$1'));
    };

    return BorderImage;

  })(Declaration);

  module.exports = BorderImage;

}).call(this);

},{"../declaration":7}],12:[function(_dereq_,module,exports){
(function() {
  var BorderRadius, Declaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = _dereq_('../declaration');

  BorderRadius = (function(_super) {
    var hor, mozilla, normal, ver, _i, _j, _len, _len1, _ref, _ref1;

    __extends(BorderRadius, _super);

    BorderRadius.names = ['border-radius'];

    BorderRadius.toMozilla = {};

    BorderRadius.toNormal = {};

    _ref = ['top', 'bottom'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ver = _ref[_i];
      _ref1 = ['left', 'right'];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        hor = _ref1[_j];
        normal = "border-" + ver + "-" + hor + "-radius";
        mozilla = "border-radius-" + ver + hor;
        BorderRadius.names.push(normal);
        BorderRadius.names.push(mozilla);
        BorderRadius.toMozilla[normal] = mozilla;
        BorderRadius.toNormal[mozilla] = normal;
      }
    }

    function BorderRadius() {
      BorderRadius.__super__.constructor.apply(this, arguments);
      if (this.prefix === '-moz-') {
        this.unprefixed = BorderRadius.toNormal[this.unprefixed] || this.unprefixed;
        this.prop = this.prefix + this.unprefixed;
      }
    }

    BorderRadius.prototype.prefixProp = function(prefix) {
      var prop;
      if (prefix === '-moz-') {
        prop = BorderRadius.toMozilla[this.unprefixed] || this.unprefixed;
        if (this.rule.contain(prefix + prop)) {
          return;
        }
        return this.insertBefore(prefix + prop, this.value);
      } else {
        return BorderRadius.__super__.prefixProp.apply(this, arguments);
      }
    };

    return BorderRadius;

  })(Declaration);

  module.exports = BorderRadius;

}).call(this);

},{"../declaration":7}],13:[function(_dereq_,module,exports){
(function() {
  var DisplayFlex, FlexDeclaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = _dereq_('./flex-declaration');

  DisplayFlex = (function(_super) {
    __extends(DisplayFlex, _super);

    DisplayFlex.names = ['display'];

    function DisplayFlex() {
      var name, prefix, _ref;
      DisplayFlex.__super__.constructor.apply(this, arguments);
      _ref = FlexDeclaration.split(this.value), prefix = _ref[0], name = _ref[1];
      if (name === 'flex' || name === 'box' || name === 'flexbox') {
        this.prefix = prefix;
        this.unprefixed = 'display-flex';
        this.prop = this.prefix + this.unprefixed;
      } else if (name === 'inline-flex' || name === 'inline-flexbox') {
        this.prefix = prefix;
        this.unprefixed = 'display-flex';
        this.prop = this.prefix + this.unprefixed;
        this.inline = true;
      }
    }

    DisplayFlex.prototype.prefixProp = function(prefix) {
      var spec, _ref;
      if (this.unprefixed !== 'display-flex') {
        return DisplayFlex.__super__.prefixProp.apply(this, arguments);
      } else {
        _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
        if (spec === '2009') {
          if (!this.inline) {
            return this.prefixDisplay(prefix, 'box');
          }
        } else if (spec === '2012') {
          return this.prefixDisplay(prefix, this.inline ? 'inline-flexbox' : 'flexbox');
        } else if (spec === 'final') {
          return this.prefixDisplay(prefix, this.inline ? 'inline-flex' : 'flex');
        }
      }
    };

    DisplayFlex.prototype.prefixDisplay = function(prefix, name) {
      return this.insertBefore('display', prefix + name);
    };

    return DisplayFlex;

  })(FlexDeclaration);

  module.exports = DisplayFlex;

}).call(this);

},{"./flex-declaration":17}],14:[function(_dereq_,module,exports){
(function() {
  var FillAvailable, OldValue, Value, utils, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  OldValue = _dereq_('../old-value');

  Value = _dereq_('../value');

  utils = _dereq_('../utils');

  FillAvailable = (function(_super) {
    __extends(FillAvailable, _super);

    function FillAvailable() {
      _ref = FillAvailable.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FillAvailable.names = ['fill-available'];

    FillAvailable.prototype.addPrefix = function(prefix, string) {
      if (prefix === '-moz-') {
        return string.replace(this.regexp, '$1-moz-available$3');
      } else {
        return FillAvailable.__super__.addPrefix.apply(this, arguments);
      }
    };

    FillAvailable.prototype.old = function(prefix) {
      if (prefix === '-moz-') {
        return new OldValue('-moz-available');
      } else {
        return FillAvailable.__super__.old.apply(this, arguments);
      }
    };

    return FillAvailable;

  })(Value);

  module.exports = FillAvailable;

}).call(this);

},{"../old-value":32,"../utils":38,"../value":39}],15:[function(_dereq_,module,exports){
(function() {
  var Declaration, Filter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = _dereq_('../declaration');

  Filter = (function(_super) {
    __extends(Filter, _super);

    Filter.names = ['filter'];

    function Filter() {
      Filter.__super__.constructor.apply(this, arguments);
      if (this.value.indexOf('DXImageTransform.Microsoft') !== -1 || this.value.indexOf('alpha(') !== -1) {
        this.unprefixed = this.prop = '-ms-filter';
      }
    }

    return Filter;

  })(Declaration);

  module.exports = Filter;

}).call(this);

},{"../declaration":7}],16:[function(_dereq_,module,exports){
(function() {
  var FlexBasis, FlexDeclaration, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = _dereq_('./flex-declaration');

  FlexBasis = (function(_super) {
    __extends(FlexBasis, _super);

    function FlexBasis() {
      _ref = FlexBasis.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlexBasis.names = ['flex-basis'];

    FlexBasis.prototype.prefixProp = function(prefix) {
      var spec, _ref1;
      _ref1 = this.flexSpec(prefix), spec = _ref1[0], prefix = _ref1[1];
      if (spec === '2012') {
        return this.insertBefore(prefix + 'flex', '0 1 ' + this.value);
      } else if (spec === 'final') {
        return FlexBasis.__super__.prefixProp.apply(this, arguments);
      }
    };

    return FlexBasis;

  })(FlexDeclaration);

  module.exports = FlexBasis;

}).call(this);

},{"./flex-declaration":17}],17:[function(_dereq_,module,exports){
(function() {
  var Declaration, FlexDeclaration, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = _dereq_('../declaration');

  FlexDeclaration = (function(_super) {
    __extends(FlexDeclaration, _super);

    function FlexDeclaration() {
      _ref = FlexDeclaration.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlexDeclaration.prototype.flexSpec = function(prefix) {
      var spec;
      spec = prefix === '-webkit- 2009' || prefix === '-moz-' ? '2009' : prefix === '-ms-' ? '2012' : prefix === '-webkit-' ? 'final' : void 0;
      if (prefix === '-webkit- 2009') {
        prefix = '-webkit-';
      }
      return [spec, prefix];
    };

    return FlexDeclaration;

  })(Declaration);

  module.exports = FlexDeclaration;

}).call(this);

},{"../declaration":7}],18:[function(_dereq_,module,exports){
(function() {
  var FlexDeclaration, FlexDirection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = _dereq_('./flex-declaration');

  FlexDirection = (function(_super) {
    __extends(FlexDirection, _super);

    FlexDirection.names = ['flex-direction', 'box-direction', 'box-orient'];

    function FlexDirection() {
      FlexDirection.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'flex-direction';
      this.prop = this.prefix + this.unprefixed;
    }

    FlexDirection.prototype.prefixProp = function(prefix) {
      var dir, orient, spec, _ref;
      _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === '2009') {
        orient = this.value.indexOf('row') !== -1 ? 'horizontal' : 'vertical';
        this.insertBefore(prefix + 'box-orient', orient);
        dir = this.value.indexOf('reverse') !== -1 ? 'reverse' : 'normal';
        return this.insertBefore(prefix + 'box-direction', dir);
      } else {
        return FlexDirection.__super__.prefixProp.apply(this, arguments);
      }
    };

    return FlexDirection;

  })(FlexDeclaration);

  module.exports = FlexDirection;

}).call(this);

},{"./flex-declaration":17}],19:[function(_dereq_,module,exports){
(function() {
  var FlexDeclaration, FlexFlow, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = _dereq_('./flex-declaration');

  FlexFlow = (function(_super) {
    __extends(FlexFlow, _super);

    function FlexFlow() {
      _ref = FlexFlow.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlexFlow.names = ['flex-flow'];

    FlexFlow.prototype.prefixProp = function(prefix) {
      var spec, _ref1;
      _ref1 = this.flexSpec(prefix), spec = _ref1[0], prefix = _ref1[1];
      if (spec === '2012') {
        return FlexFlow.__super__.prefixProp.apply(this, arguments);
      } else if (spec === 'final') {
        return FlexFlow.__super__.prefixProp.apply(this, arguments);
      }
    };

    return FlexFlow;

  })(FlexDeclaration);

  module.exports = FlexFlow;

}).call(this);

},{"./flex-declaration":17}],20:[function(_dereq_,module,exports){
(function() {
  var Flex, FlexDeclaration, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = _dereq_('./flex-declaration');

  Flex = (function(_super) {
    __extends(Flex, _super);

    function Flex() {
      _ref = Flex.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Flex.names = ['flex-grow'];

    Flex.prototype.prefixProp = function(prefix) {
      var spec, _ref1;
      _ref1 = this.flexSpec(prefix), spec = _ref1[0], prefix = _ref1[1];
      if (spec === '2009') {
        return this.insertBefore(prefix + 'box-flex', this.value);
      } else if (spec === '2012') {
        return this.insertBefore(prefix + 'flex', this.value);
      } else if (spec === 'final') {
        return Flex.__super__.prefixProp.apply(this, arguments);
      }
    };

    return Flex;

  })(FlexDeclaration);

  module.exports = Flex;

}).call(this);

},{"./flex-declaration":17}],21:[function(_dereq_,module,exports){
(function() {
  var FlexDeclaration, FlexShrink, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = _dereq_('./flex-declaration');

  FlexShrink = (function(_super) {
    __extends(FlexShrink, _super);

    function FlexShrink() {
      _ref = FlexShrink.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlexShrink.names = ['flex-shrink'];

    FlexShrink.prototype.prefixProp = function(prefix) {
      var spec, _ref1;
      _ref1 = this.flexSpec(prefix), spec = _ref1[0], prefix = _ref1[1];
      if (spec === '2012') {
        return this.insertBefore(prefix + 'flex', '0 ' + this.value);
      } else if (spec === 'final') {
        return FlexShrink.__super__.prefixProp.apply(this, arguments);
      }
    };

    return FlexShrink;

  })(FlexDeclaration);

  module.exports = FlexShrink;

}).call(this);

},{"./flex-declaration":17}],22:[function(_dereq_,module,exports){
(function() {
  var FlexDeclaration, FlexWrap, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = _dereq_('./flex-declaration');

  FlexWrap = (function(_super) {
    __extends(FlexWrap, _super);

    function FlexWrap() {
      _ref = FlexWrap.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FlexWrap.names = ['flex-wrap'];

    FlexWrap.prototype.prefixProp = function(prefix) {
      var spec, _ref1;
      _ref1 = this.flexSpec(prefix), spec = _ref1[0], prefix = _ref1[1];
      if (spec === '2012') {
        return FlexWrap.__super__.prefixProp.apply(this, arguments);
      } else if (spec === 'final') {
        return FlexWrap.__super__.prefixProp.apply(this, arguments);
      }
    };

    return FlexWrap;

  })(FlexDeclaration);

  module.exports = FlexWrap;

}).call(this);

},{"./flex-declaration":17}],23:[function(_dereq_,module,exports){
(function() {
  var Flex, FlexDeclaration,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = _dereq_('./flex-declaration');

  Flex = (function(_super) {
    __extends(Flex, _super);

    Flex.names = ['flex', 'box-flex'];

    function Flex() {
      Flex.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'flex';
      this.prop = this.prefix + this.unprefixed;
    }

    Flex.prototype.prefixProp = function(prefix) {
      var first, spec, _ref;
      _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === '2009') {
        first = this.value.split(' ')[0];
        return this.insertBefore(prefix + 'box-flex', first);
      } else if (spec === '2012') {
        return Flex.__super__.prefixProp.apply(this, arguments);
      } else if (spec === 'final') {
        return Flex.__super__.prefixProp.apply(this, arguments);
      }
    };

    return Flex;

  })(FlexDeclaration);

  module.exports = Flex;

}).call(this);

},{"./flex-declaration":17}],24:[function(_dereq_,module,exports){
(function() {
  var Fullscreen, Selector, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Selector = _dereq_('../selector');

  Fullscreen = (function(_super) {
    __extends(Fullscreen, _super);

    function Fullscreen() {
      _ref = Fullscreen.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Fullscreen.names = [':fullscreen'];

    Fullscreen.prototype.prefixed = function(prefix) {
      if ('-webkit-' === prefix) {
        return ':-webkit-full-screen';
      } else if ('-moz-' === prefix) {
        return ':-moz-full-screen';
      } else {
        return ":" + prefix + "fullscreen";
      }
    };

    return Fullscreen;

  })(Selector);

  module.exports = Fullscreen;

}).call(this);

},{"../selector":37}],25:[function(_dereq_,module,exports){
(function() {
  var Gradient, OldValue, Value, isDirection, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  OldValue = _dereq_('../old-value');

  Value = _dereq_('../value');

  utils = _dereq_('../utils');

  isDirection = new RegExp('(top|left|right|bottom)', 'gi');

  Gradient = (function(_super) {
    var i, _i, _len, _ref;

    __extends(Gradient, _super);

    Gradient.names = ['linear-gradient', 'repeating-linear-gradient', 'radial-gradient', 'repeating-radial-gradient'];

    Gradient.starts = new RegExp('(^|\\s*)' + Gradient.names.join('|'), 'i');

    Gradient.regexps = {};

    _ref = Gradient.names;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      Gradient.regexps[i] = new RegExp('(^|\\s|,)' + i + '\\((.+)\\)', 'gi');
    }

    function Gradient(name, prefixes) {
      this.name = name;
      this.prefixes = prefixes;
      this.regexp = Gradient.regexps[this.name];
    }

    Gradient.prototype.addPrefix = function(prefix, string) {
      var _this = this;
      return string.replace(this.regexp, function(all, before, args) {
        var decl, prefixedDecls, _j, _len1, _ref1;
        prefixedDecls = [];
        _ref1 = _this.splitDecls(all);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          decl = _ref1[_j];
          prefixedDecls.push(decl.replace(_this.regexp, function(all, before, args) {
            var params;
            params = _this.splitParams(args);
            params = _this.newDirection(params);
            if (prefix === '-webkit- old') {
              if (_this.name !== 'linear-gradient') {
                return all;
              }
              if (params[0] && params[0].indexOf('deg') !== -1) {
                return all;
              }
              if (args.indexOf('-corner') !== -1) {
                return all;
              }
              if (args.indexOf('-side') !== -1) {
                return all;
              }
              params = _this.oldDirection(params);
              params = _this.colorStops(params);
              return '-webkit-gradient(linear, ' + params.join(', ') + ')';
            } else {
              if (params.length > 0) {
                if (params[0].slice(0, 3) === 'to ') {
                  params[0] = _this.fixDirection(params[0]);
                } else if (params[0].indexOf('deg') !== -1) {
                  params[0] = _this.fixAngle(params[0]);
                } else if (params[0].indexOf(' at ') !== -1) {
                  _this.fixRadial(params);
                }
              }
              return before + prefix + _this.name + '(' + params.join(', ') + ')';
            }
          }));
        }
        return prefixedDecls.join(',');
      });
    };

    Gradient.prototype.directions = {
      top: 'bottom',
      left: 'right',
      bottom: 'top',
      right: 'left'
    };

    Gradient.prototype.oldDirections = {
      'top': 'left bottom, left top',
      'left': 'right top, left top',
      'bottom': 'left top, left bottom',
      'right': 'left top, right top',
      'top right': 'left bottom, right top',
      'top left': 'right bottom, left top',
      'bottom right': 'left top, right bottom',
      'bottom left': 'right top, left bottom'
    };

    Gradient.prototype.splitDecls = function(decl) {
      var chunks, currentDecl, decls, _j, _len1;
      decls = [];
      chunks = decl.split(',');
      currentDecl = [];
      for (_j = 0, _len1 = chunks.length; _j < _len1; _j++) {
        i = chunks[_j];
        if (Gradient.starts.test(i)) {
          if (currentDecl.length === 0) {
            currentDecl.push(i);
          } else {
            decls.push(currentDecl.join(','));
            currentDecl = [i];
          }
        } else {
          currentDecl.push(i);
        }
      }
      decls.push(currentDecl.join(','));
      return decls;
    };

    Gradient.prototype.splitParams = function(params) {
      var array, char, func, param, _j, _len1;
      array = [];
      param = '';
      func = 0;
      for (_j = 0, _len1 = params.length; _j < _len1; _j++) {
        char = params[_j];
        if (char === ')' && func > 0) {
          func -= 1;
          param += char;
        } else if (char === '(') {
          param += char;
          func += 1;
        } else if (func > 0) {
          param += char;
        } else if (char === ',') {
          array.push(param.trim());
          param = '';
        } else {
          param += char;
        }
      }
      array.push(param.trim());
      return array;
    };

    Gradient.prototype.newDirection = function(params) {
      var first, value;
      first = params[0];
      if (first.indexOf('to ') === -1 && isDirection.test(first)) {
        first = first.split(' ');
        first = (function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = first.length; _j < _len1; _j++) {
            value = first[_j];
            _results.push(this.directions[value.toLowerCase()] || value);
          }
          return _results;
        }).call(this);
        params[0] = 'to ' + first.join(' ');
      }
      return params;
    };

    Gradient.prototype.fixDirection = function(param) {
      var value;
      param = param.split(' ');
      param.splice(0, 1);
      param = (function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = param.length; _j < _len1; _j++) {
          value = param[_j];
          _results.push(this.directions[value.toLowerCase()] || value);
        }
        return _results;
      }).call(this);
      return param.join(' ');
    };

    Gradient.prototype.roundFloat = function(float, digits) {
      return parseFloat(float.toFixed(digits));
    };

    Gradient.prototype.fixAngle = function(param) {
      param = parseFloat(param);
      param = Math.abs(450 - param) % 360;
      param = this.roundFloat(param, 3);
      return "" + param + "deg";
    };

    Gradient.prototype.fixRadial = function(params) {
      var first;
      first = params[0].split(/\s+at\s+/);
      return params.splice(0, 1, first[1], first[0]);
    };

    Gradient.prototype.oldDirection = function(params) {
      var direction;
      if (params.length === 0) {
        params;
      }
      if (params[0].indexOf('to ') !== -1) {
        direction = params[0].replace(/^to\s+/, '');
        direction = this.oldDirections[direction];
        params[0] = direction;
        return params;
      } else {
        direction = this.oldDirections.bottom;
        return [direction].concat(params);
      }
    };

    Gradient.prototype.colorStops = function(params) {
      return params.map(function(param, i) {
        var color, position, separator;
        if (i === 0) {
          return param;
        }
        separator = param.lastIndexOf(' ');
        if (separator === -1) {
          color = param;
          position = void 0;
        } else {
          color = param.slice(0, separator);
          position = param.slice(separator + 1);
        }
        if (position && position.indexOf(')') !== -1) {
          color += ' ' + position;
          position = void 0;
        }
        if (i === 1) {
          return "from(" + color + ")";
        } else if (i === params.length - 1) {
          return "to(" + color + ")";
        } else if (position) {
          return "color-stop(" + position + ", " + color + ")";
        } else {
          return "color-stop(" + color + ")";
        }
      });
    };

    Gradient.prototype.old = function(prefix) {
      var regexp, string, type;
      if (prefix === '-webkit-') {
        type = this.name === 'linear-gradient' ? 'linear' : 'radial';
        string = '-gradient';
        regexp = utils.regexp("-webkit-(" + type + "-gradient|gradient\\(\\s*" + type + ")", false);
        return new OldValue(prefix + this.name, string, regexp);
      } else {
        return Gradient.__super__.old.apply(this, arguments);
      }
    };

    return Gradient;

  })(Value);

  module.exports = Gradient;

}).call(this);

},{"../old-value":32,"../utils":38,"../value":39}],26:[function(_dereq_,module,exports){
(function() {
  var FlexDeclaration, JustifyContent,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = _dereq_('./flex-declaration');

  JustifyContent = (function(_super) {
    __extends(JustifyContent, _super);

    JustifyContent.names = ['justify-content', 'flex-pack', 'box-pack'];

    JustifyContent.oldValues = {
      'flex-end': 'end',
      'flex-start': 'start',
      'space-between': 'justify',
      'space-around': 'distribute'
    };

    function JustifyContent() {
      JustifyContent.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'justify-content';
      this.prop = this.prefix + this.unprefixed;
    }

    JustifyContent.prototype.prefixProp = function(prefix) {
      var oldValue, spec, _ref;
      _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      oldValue = JustifyContent.oldValues[this.value] || this.value;
      if (spec === '2009') {
        if (this.value !== 'space-around') {
          return this.insertBefore(prefix + 'box-pack', oldValue);
        }
      } else if (spec === '2012') {
        return this.insertBefore(prefix + 'flex-pack', oldValue);
      } else if (spec === 'final') {
        return JustifyContent.__super__.prefixProp.apply(this, arguments);
      }
    };

    return JustifyContent;

  })(FlexDeclaration);

  module.exports = JustifyContent;

}).call(this);

},{"./flex-declaration":17}],27:[function(_dereq_,module,exports){
(function() {
  var FlexDeclaration, Order,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  FlexDeclaration = _dereq_('./flex-declaration');

  Order = (function(_super) {
    __extends(Order, _super);

    Order.names = ['order', 'flex-order', 'box-ordinal-group'];

    function Order() {
      Order.__super__.constructor.apply(this, arguments);
      this.unprefixed = 'order';
      this.prop = this.prefix + this.unprefixed;
    }

    Order.prototype.prefixProp = function(prefix) {
      var oldValue, spec, _ref;
      _ref = this.flexSpec(prefix), spec = _ref[0], prefix = _ref[1];
      if (spec === '2009') {
        oldValue = parseInt(this.value) + 1;
        return this.insertBefore(prefix + 'box-ordinal-group', oldValue.toString());
      } else if (spec === '2012') {
        return this.insertBefore(prefix + 'flex-order', this.value);
      } else if (spec === 'final') {
        return Order.__super__.prefixProp.apply(this, arguments);
      }
    };

    return Order;

  })(FlexDeclaration);

  module.exports = Order;

}).call(this);

},{"./flex-declaration":17}],28:[function(_dereq_,module,exports){
(function() {
  var Placeholder, Selector, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Selector = _dereq_('../selector');

  Placeholder = (function(_super) {
    __extends(Placeholder, _super);

    function Placeholder() {
      _ref = Placeholder.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Placeholder.names = ['::placeholder'];

    Placeholder.prototype.prefixed = function(prefix) {
      if ('-webkit-' === prefix) {
        return '::-webkit-input-placeholder';
      } else if ('-ms-' === prefix) {
        return ':-ms-input-placeholder';
      } else {
        return "::" + prefix + "placeholder";
      }
    };

    return Placeholder;

  })(Selector);

  module.exports = Placeholder;

}).call(this);

},{"../selector":37}],29:[function(_dereq_,module,exports){
(function() {
  var Declaration, Transition, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Declaration = _dereq_('../declaration');

  Transition = (function(_super) {
    __extends(Transition, _super);

    function Transition() {
      _ref = Transition.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Transition.names = ['transition', 'transition-property'];

    Transition.prototype.prefixValue = function(prefix, value) {
      if (prefix === '-ms-' && value.name === 'transform') {

      } else {
        return Transition.__super__.prefixValue.apply(this, arguments);
      }
    };

    return Transition;

  })(Declaration);

  module.exports = Transition;

}).call(this);

},{"../declaration":7}],30:[function(_dereq_,module,exports){
(function() {
  var capitalize, names, prefix;

  capitalize = function(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
  };

  names = {
    ie: 'IE',
    ff: 'Firefox',
    ios: 'iOS'
  };

  prefix = function(name, transition, prefixes) {
    var out;
    out = '  ' + name + (transition ? '*' : '') + ': ';
    out += prefixes.map(function(i) {
      return i.replace(/^-(.*)-$/g, '$1');
    }).join(', ');
    out += "\n";
    return out;
  };

  module.exports = function(prefixes) {
    var browser, data, list, name, needTransition, out, props, string, transitionProp, useTransition, value, values, version, versions, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3, _ref4;
    if (prefixes.browsers.selected.length === 0) {
      return "No browsers selected";
    }
    versions = [];
    _ref = prefixes.browsers.selected;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      browser = _ref[_i];
      _ref1 = browser.split(' '), name = _ref1[0], version = _ref1[1];
      name = names[name] || capitalize(name);
      if (versions[name]) {
        versions[name].push(version);
      } else {
        versions[name] = [version];
      }
    }
    out = "Browsers:\n";
    for (browser in versions) {
      list = versions[browser];
      list = list.sort(function(a, b) {
        return parseFloat(b) - parseFloat(a);
      });
      out += '  ' + browser + ': ' + list.join(', ') + "\n";
    }
    values = '';
    props = '';
    useTransition = false;
    needTransition = (_ref2 = prefixes.add.transition) != null ? _ref2.prefixes : void 0;
    _ref3 = prefixes.add;
    for (name in _ref3) {
      data = _ref3[name];
      if (data.prefixes) {
        transitionProp = needTransition && prefixes.data[name].transition;
        if (transitionProp) {
          useTransition = true;
        }
        props += prefix(name, transitionProp, data.prefixes);
      }
      if (!data.values) {
        continue;
      }
      if (prefixes.transitionProps.some(function(i) {
        return i === name;
      })) {
        continue;
      }
      _ref4 = data.values;
      for (_j = 0, _len1 = _ref4.length; _j < _len1; _j++) {
        value = _ref4[_j];
        string = prefix(value.name, false, value.prefixes);
        if (values.indexOf(string) === -1) {
          values += string;
        }
      }
    }
    if (useTransition) {
      props += "  * - can be used in transition\n";
    }
    if (props !== '') {
      out += "\nProperties:\n" + props;
    }
    if (values !== '') {
      out += "\nValues:\n" + values;
    }
    return out;
  };

}).call(this);

},{}],31:[function(_dereq_,module,exports){
(function() {
  var Keyframes, utils;

  utils = _dereq_('./utils');

  Keyframes = (function() {
    function Keyframes(css, number, rule) {
      this.css = css;
      this.number = number;
      this.rule = rule;
      this.prefix = this.rule.vendor;
    }

    Keyframes.prototype.clone = function() {
      return utils.clone(this.rule, {
        keyframes: this.rule.keyframes.map(function(i) {
          if (i.type === 'keyframe') {
            return utils.clone(i, {
              values: i.values.slice(),
              declarations: i.declarations.map(function(decl) {
                return utils.clone(decl);
              })
            });
          } else {
            return utils.clone(i);
          }
        })
      });
    };

    Keyframes.prototype.cloneWithPrefix = function(prefix) {
      var clone;
      clone = this.clone();
      clone.vendor = prefix;
      this.css.addKeyframes(this.number, clone);
      return this.number += 1;
    };

    Keyframes.prototype.remove = function() {
      return this.css.removeKeyframes(this.number);
    };

    return Keyframes;

  })();

  module.exports = Keyframes;

}).call(this);

},{"./utils":38}],32:[function(_dereq_,module,exports){
(function() {
  var OldValue, utils;

  utils = _dereq_('./utils');

  OldValue = (function() {
    function OldValue(name, string, regexp) {
      this.name = name;
      this.string = string;
      this.regexp = regexp;
      this.regexp || (this.regexp = utils.regexp(this.name));
      this.string || (this.string = this.name);
    }

    OldValue.prototype.check = function(value) {
      if (value.indexOf(this.string) !== -1) {
        return !!value.match(this.regexp);
      } else {
        return false;
      }
    };

    return OldValue;

  })();

  module.exports = OldValue;

}).call(this);

},{"./utils":38}],33:[function(_dereq_,module,exports){
(function() {
  var Prefixes, Processor, Selector, Value, utils;

  utils = _dereq_('./utils');

  Processor = _dereq_('./processor');

  Selector = _dereq_('./selector');

  Value = _dereq_('./value');

  Value.register(_dereq_('./hacks/gradient'));

  Value.register(_dereq_('./hacks/fill-available'));

  Selector.register(_dereq_('./hacks/fullscreen'));

  Selector.register(_dereq_('./hacks/placeholder'));

  Prefixes = (function() {
    function Prefixes(data, browsers) {
      var _ref;
      this.data = data;
      this.browsers = browsers;
      _ref = this.preprocess(this.select(this.data)), this.add = _ref[0], this.remove = _ref[1];
      this.otherCache = {};
      this.processor = new Processor(this);
    }

    Prefixes.prototype.transitionProps = ['transition', 'transition-property'];

    Prefixes.prototype.select = function(list) {
      var add, all, data, name, selected,
        _this = this;
      selected = {
        add: {},
        remove: {}
      };
      for (name in list) {
        data = list[name];
        add = data.browsers.map(function(i) {
          var params;
          params = i.split(' ');
          return {
            browser: params[0] + ' ' + params[1],
            note: params[2]
          };
        });
        add = add.filter(function(i) {
          return _this.browsers.isSelected(i.browser);
        }).map(function(i) {
          var prefix;
          prefix = _this.browsers.prefix(i.browser);
          if (i.note) {
            return prefix + ' ' + i.note;
          } else {
            return prefix;
          }
        });
        add = utils.uniq(add).sort(function(a, b) {
          return b.length - a.length;
        });
        all = data.browsers.map(function(i) {
          return _this.browsers.prefix(i);
        });
        if (data.mistakes) {
          all = all.concat(data.mistakes);
        }
        all = utils.uniq(all);
        if (add.length) {
          selected.add[name] = add;
          if (add.length < all.length) {
            selected.remove[name] = all.filter(function(i) {
              return add.indexOf(i) === -1;
            });
          }
        } else {
          selected.remove[name] = all;
        }
      }
      return selected;
    };

    Prefixes.prototype.preprocess = function(selected) {
      var add, name, old, prefix, prefixed, prefixes, prop, props, remove, selector, value, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1;
      add = {
        selectors: []
      };
      _ref = selected.add;
      for (name in _ref) {
        prefixes = _ref[name];
        if (this.data[name].selector) {
          add.selectors.push(Selector.load(name, prefixes));
        } else {
          props = this.data[name].transition ? this.transitionProps : this.data[name].props;
          if (props) {
            value = Value.load(name, prefixes);
            for (_i = 0, _len = props.length; _i < _len; _i++) {
              prop = props[_i];
              if (!add[prop]) {
                add[prop] = {};
              }
              if (!add[prop].values) {
                add[prop].values = [];
              }
              add[prop].values.push(value);
            }
          }
          if (!this.data[name].props) {
            if (!add[name]) {
              add[name] = {};
            }
            add[name].prefixes = prefixes;
          }
        }
      }
      remove = {
        selectors: []
      };
      _ref1 = selected.remove;
      for (name in _ref1) {
        prefixes = _ref1[name];
        if (this.data[name].selector) {
          selector = Selector.load(name, prefixes);
          for (_j = 0, _len1 = prefixes.length; _j < _len1; _j++) {
            prefix = prefixes[_j];
            remove.selectors.push(selector.prefixed(prefix));
          }
        } else {
          props = this.data[name].transition ? this.transitionProps : this.data[name].props;
          if (props) {
            value = Value.load(name);
            for (_k = 0, _len2 = prefixes.length; _k < _len2; _k++) {
              prefix = prefixes[_k];
              old = value.old(prefix);
              for (_l = 0, _len3 = props.length; _l < _len3; _l++) {
                prop = props[_l];
                if (!remove[prop]) {
                  remove[prop] = {};
                }
                if (!remove[prop].values) {
                  remove[prop].values = [];
                }
                remove[prop].values.push(old);
              }
            }
          }
          if (!this.data[name].props) {
            for (_m = 0, _len4 = prefixes.length; _m < _len4; _m++) {
              prefix = prefixes[_m];
              prefixed = prefix + name;
              if (!remove[prefixed]) {
                remove[prefixed] = {};
              }
              remove[prefixed].remove = true;
            }
          }
        }
      }
      return [add, remove];
    };

    Prefixes.prototype.other = function(prefix) {
      var _base;
      return (_base = this.otherCache)[prefix] || (_base[prefix] = this.browsers.prefixes().filter(function(i) {
        return i !== prefix;
      }));
    };

    Prefixes.prototype.each = function(prop, callback) {
      var prefix, _i, _len, _ref, _results;
      if (this.add[prop] && this.add[prop].prefixes) {
        _ref = this.add[prop].prefixes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          prefix = _ref[_i];
          _results.push(callback(prefix));
        }
        return _results;
      }
    };

    Prefixes.prototype.isCustom = function(prefix) {
      return this.browsers.prefixes().indexOf(prefix) === -1;
    };

    Prefixes.prototype.values = function(type, prop) {
      var data, global, values, _ref, _ref1;
      data = this[type];
      global = (_ref = data['*']) != null ? _ref.values : void 0;
      values = (_ref1 = data[prop]) != null ? _ref1.values : void 0;
      if (global && values) {
        return utils.uniq(global.concat(values));
      } else {
        return global || values || [];
      }
    };

    Prefixes.prototype.toRemove = function(prop) {
      var _ref;
      return (_ref = this.remove[prop]) != null ? _ref.remove : void 0;
    };

    return Prefixes;

  })();

  module.exports = Prefixes;

}).call(this);

},{"./hacks/fill-available":14,"./hacks/fullscreen":24,"./hacks/gradient":25,"./hacks/placeholder":28,"./processor":34,"./selector":37,"./utils":38,"./value":39}],34:[function(_dereq_,module,exports){
(function() {
  var Processor, utils;

  utils = _dereq_('./utils');

  Processor = (function() {
    function Processor(prefixes) {
      this.prefixes = prefixes;
    }

    Processor.prototype.add = function(css) {
      var selector, _i, _len, _ref,
        _this = this;
      css.eachKeyframes(function(keyframes) {
        if (keyframes.prefix) {
          return;
        }
        return _this.prefixes.each('@keyframes', function(prefix) {
          return keyframes.cloneWithPrefix(prefix);
        });
      });
      _ref = this.prefixes.add.selectors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selector = _ref[_i];
        css.eachRule(function(rule) {
          if (!rule.selectors) {
            return;
          }
          if (selector.check(rule.selectors)) {
            return rule.prefixSelector(selector);
          }
        });
      }
      css.eachDeclaration(function(decl, vendor) {
        if (_this.prefixes.isCustom(vendor)) {
          vendor = null;
        }
        return _this.prefixes.each(decl.prop, function(prefix) {
          if (vendor && vendor !== utils.removeNote(prefix)) {
            return;
          }
          if (decl.valueContain(_this.prefixes.other(prefix))) {
            return;
          }
          return decl.prefixProp(prefix);
        });
      });
      return css.eachDeclaration(function(decl, vendor) {
        var prefix, value, _j, _k, _len1, _len2, _ref1, _ref2;
        if (_this.prefixes.isCustom(vendor)) {
          vendor = null;
        }
        _ref1 = _this.prefixes.values('add', decl.unprefixed);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          value = _ref1[_j];
          if (!value.check(decl.value)) {
            continue;
          }
          _ref2 = value.prefixes;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            prefix = _ref2[_k];
            if (vendor && vendor !== utils.removeNote(prefix)) {
              continue;
            }
            decl.prefixValue(prefix, value);
          }
        }
        return decl.saveValues();
      });
    };

    Processor.prototype.remove = function(css) {
      var selector, _i, _len, _ref,
        _this = this;
      css.eachKeyframes(function(keyframes) {
        if (_this.prefixes.toRemove(keyframes.prefix + '@keyframes')) {
          return keyframes.remove();
        }
      });
      _ref = this.prefixes.remove.selectors;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        selector = _ref[_i];
        css.eachRule(function(rule) {
          if (!rule.selectors) {
            return;
          }
          if (rule.selectors.indexOf(selector) !== -1) {
            return rule.remove();
          }
        });
      }
      return css.eachDeclaration(function(decl, vendor) {
        var checker, _j, _len1, _ref1;
        if (_this.prefixes.toRemove(decl.prop)) {
          if (decl.rule.byProp(decl.unprefixed)) {
            decl.remove();
            return;
          }
        }
        _ref1 = _this.prefixes.values('remove', decl.unprefixed);
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          checker = _ref1[_j];
          if (checker.check(decl.value)) {
            decl.remove();
            return;
          }
        }
      });
    };

    return Processor;

  })();

  module.exports = Processor;

}).call(this);

},{"./utils":38}],35:[function(_dereq_,module,exports){
(function() {
  var Declaration, Rule, utils;

  utils = _dereq_('./utils');

  Declaration = _dereq_('./declaration');

  Declaration.register(_dereq_('./hacks/filter'));

  Declaration.register(_dereq_('./hacks/border-radius'));

  Declaration.register(_dereq_('./hacks/flex'));

  Declaration.register(_dereq_('./hacks/order'));

  Declaration.register(_dereq_('./hacks/flex-grow'));

  Declaration.register(_dereq_('./hacks/flex-wrap'));

  Declaration.register(_dereq_('./hacks/flex-flow'));

  Declaration.register(_dereq_('./hacks/transition'));

  Declaration.register(_dereq_('./hacks/align-self'));

  Declaration.register(_dereq_('./hacks/flex-basis'));

  Declaration.register(_dereq_('./hacks/flex-shrink'));

  Declaration.register(_dereq_('./hacks/align-items'));

  Declaration.register(_dereq_('./hacks/border-image'));

  Declaration.register(_dereq_('./hacks/display-flex'));

  Declaration.register(_dereq_('./hacks/align-content'));

  Declaration.register(_dereq_('./hacks/flex-direction'));

  Declaration.register(_dereq_('./hacks/justify-content'));

  Rule = (function() {
    function Rule(rules, number, node, prefix) {
      var match;
      this.rules = rules;
      this.number = number;
      this.node = node;
      this.prefix = prefix;
      this.type = this.node.type;
      this.declarations = this.node.declarations;
      if (this.type === 'rule') {
        this.selectors = this.node.selectors.join(', ');
        if (!this.prefix) {
          match = this.selectors.match(/(^|\s|:)(-(\w+)-)/);
          if (match) {
            this.prefix = match[2];
          }
        }
      }
    }

    Rule.prototype.each = function(callback) {
      var decl, item;
      this.number = 0;
      while (this.number < this.declarations.length) {
        item = this.declarations[this.number];
        if (item.property) {
          decl = Declaration.load(this, this.number, item);
          callback(decl, decl.prefix || this.prefix);
        }
        this.number += 1;
      }
      return false;
    };

    Rule.prototype.prefixSelector = function(selector) {
      var clone, prefix, prefixed, _i, _len, _ref, _results;
      _ref = selector.prefixes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        prefix = _ref[_i];
        prefixed = selector.replace(this.selectors, prefix);
        if (!this.rules.contain(prefixed)) {
          clone = utils.clone(this.node, {
            selectors: prefixed.split(', ')
          });
          _results.push(this.rules.add(this.number, clone));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Rule.prototype.contain = function(prop, value) {
      if (value != null) {
        return this.declarations.some(function(i) {
          return i.property === prop && i.value === value;
        });
      } else {
        return this.declarations.some(function(i) {
          return i.property === prop;
        });
      }
    };

    Rule.prototype.byProp = function(prop) {
      var decl, i, node, _i, _len, _ref;
      _ref = this.declarations;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        node = _ref[i];
        if (node.property) {
          decl = Declaration.load(this, i, node);
          if (decl.prop === prop) {
            return decl;
          }
        }
      }
      return null;
    };

    Rule.prototype.remove = function() {
      return this.rules.remove(this.number);
    };

    Rule.prototype.add = function(position, decl) {
      this.declarations.splice(position, 0, decl);
      return this.number += 1;
    };

    Rule.prototype.removeDecl = function(position) {
      this.declarations.splice(position, 1);
      return this.number -= 1;
    };

    return Rule;

  })();

  module.exports = Rule;

}).call(this);

},{"./declaration":7,"./hacks/align-content":8,"./hacks/align-items":9,"./hacks/align-self":10,"./hacks/border-image":11,"./hacks/border-radius":12,"./hacks/display-flex":13,"./hacks/filter":15,"./hacks/flex":23,"./hacks/flex-basis":16,"./hacks/flex-direction":18,"./hacks/flex-flow":19,"./hacks/flex-grow":20,"./hacks/flex-shrink":21,"./hacks/flex-wrap":22,"./hacks/justify-content":26,"./hacks/order":27,"./hacks/transition":29,"./utils":38}],36:[function(_dereq_,module,exports){
(function() {
  var Rule, Rules;

  Rule = _dereq_('./rule');

  Rules = (function() {
    Rules.each = function(list, callback) {
      var rules;
      rules = new Rules(list);
      return rules.each(callback);
    };

    function Rules(list) {
      this.list = list;
    }

    Rules.prototype.each = function(callback) {
      var i, keyframe, rule, _i, _len, _ref;
      this.number = 0;
      while (this.number < this.list.length) {
        i = this.list[this.number];
        if (i.rules) {
          Rules.each(i.rules, callback);
        }
        if (i.keyframes) {
          _ref = i.keyframes;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            keyframe = _ref[_i];
            if (keyframe.type === 'keyframe') {
              rule = new Rule(this, this.number, keyframe, i.vendor);
              callback(rule);
            }
          }
        }
        if (i.declarations) {
          rule = new Rule(this, this.number, i, i.vendor);
          callback(rule);
        }
        this.number += 1;
      }
      return false;
    };

    Rules.prototype.contain = function(selector) {
      var i, _i, _len, _ref;
      _ref = this.list;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        if (!i.selectors) {
          continue;
        }
        if (i.selectors.join(', ') === selector) {
          return true;
        }
      }
      return false;
    };

    Rules.prototype.add = function(position, rule) {
      this.list.splice(position, 0, rule);
      return this.number += 1;
    };

    Rules.prototype.remove = function(position) {
      this.list.splice(position, 1);
      return this.number -= 1;
    };

    return Rules;

  })();

  module.exports = Rules;

}).call(this);

},{"./rule":35}],37:[function(_dereq_,module,exports){
(function() {
  var Selector, utils;

  utils = _dereq_('./utils');

  Selector = (function() {
    Selector.register = function(klass) {
      var name, _i, _len, _ref, _results;
      _ref = klass.names;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        _results.push(this.hacks[name] = klass);
      }
      return _results;
    };

    Selector.hacks = {};

    Selector.load = function(name, prefixes) {
      var klass;
      klass = this.hacks[name];
      if (klass) {
        return new klass(name, prefixes);
      } else {
        return new Selector(name, prefixes);
      }
    };

    function Selector(name, prefixes) {
      this.name = name;
      this.prefixes = prefixes != null ? prefixes : [];
      this.prefixes = this.prefixes.sort(function(a, b) {
        return a.length - b.length;
      });
    }

    Selector.prototype.check = function(selectors) {
      return selectors.indexOf(this.name) !== -1;
    };

    Selector.prototype.prefixed = function(prefix) {
      return this.name.replace(/^([^\w]*)/, '$1' + prefix);
    };

    Selector.prototype.regexp = function() {
      return this.regexpCache || (this.regexpCache = new RegExp(utils.escapeRegexp(this.name), 'gi'));
    };

    Selector.prototype.replace = function(selectors, prefix) {
      return selectors.replace(this.regexp(), this.prefixed(prefix));
    };

    return Selector;

  })();

  module.exports = Selector;

}).call(this);

},{"./utils":38}],38:[function(_dereq_,module,exports){
(function() {
  module.exports = {
    error: function(text) {
      var err;
      err = new Error(text);
      err.autoprefixer = true;
      throw err;
    },
    uniq: function(array) {
      var filtered, i, _i, _len;
      filtered = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        i = array[_i];
        if (filtered.indexOf(i) === -1) {
          filtered.push(i);
        }
      }
      return filtered;
    },
    clone: function(obj, changes) {
      var clone, key, value;
      if (changes == null) {
        changes = {};
      }
      clone = {};
      for (key in obj) {
        value = obj[key];
        if (!changes[key]) {
          if (value instanceof Array) {
            clone[key] = value.slice(0);
          } else {
            clone[key] = value;
          }
        }
      }
      for (key in changes) {
        value = changes[key];
        clone[key] = value;
      }
      return clone;
    },
    removeNote: function(string) {
      if (string.indexOf(' ') === -1) {
        return string;
      } else {
        return string.split(' ')[0];
      }
    },
    escapeRegexp: function(string) {
      return string.replace(/([.?*+\^\$\[\]\\(){}|\-])/g, "\\$1");
    },
    regexp: function(word, escape) {
      if (escape == null) {
        escape = true;
      }
      if (escape) {
        word = this.escapeRegexp(word);
      }
      return new RegExp('(^|\\s|,|\\()(' + word + '($|\\s|\\(|,))', 'gi');
    }
  };

}).call(this);

},{}],39:[function(_dereq_,module,exports){
(function() {
  var OldValue, Value, utils;

  utils = _dereq_('./utils');

  OldValue = _dereq_('./old-value');

  Value = (function() {
    Value.register = function(klass) {
      var name, _i, _len, _ref, _results;
      _ref = klass.names;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        _results.push(this.hacks[name] = klass);
      }
      return _results;
    };

    Value.hacks = {};

    Value.load = function(name, prefixes) {
      var klass;
      klass = this.hacks[name];
      if (klass) {
        return new klass(name, prefixes);
      } else {
        return new Value(name, prefixes);
      }
    };

    Value.regexps = {};

    Value.regexp = function(name) {
      var _base;
      return (_base = this.regexps)[name] || (_base[name] = utils.regexp(name));
    };

    function Value(name, prefixes) {
      this.name = name;
      this.prefixes = prefixes;
      this.regexp = Value.regexp(this.name);
    }

    Value.prototype.check = function(value) {
      if (value.indexOf(this.name) !== -1) {
        return !!value.match(this.regexp);
      } else {
        return false;
      }
    };

    Value.prototype.old = function(prefix) {
      return new OldValue(prefix + this.name);
    };

    Value.prototype.addPrefix = function(prefix, string) {
      return string.replace(this.regexp, '$1' + prefix + '$2');
    };

    return Value;

  })();

  module.exports = Value;

}).call(this);

},{"./old-value":32,"./utils":38}],40:[function(_dereq_,module,exports){

module.exports = function(css, options){
  options = options || {};

  /**
   * Positional.
   */

  var lineno = 1;
  var column = 1;

  /**
   * Update lineno and column based on `str`.
   */

  function updatePosition(str) {
    var lines = str.match(/\n/g);
    if (lines) lineno += lines.length;
    var i = str.lastIndexOf('\n');
    column = ~i ? str.length - i : column + str.length;
  }

  /**
   * Mark position and patch `node.position`.
   */

  function position() {
    var start = { line: lineno, column: column };
    if (!options.position) return positionNoop;

    return function(node){
      node.position = {
        start: start,
        end: { line: lineno, column: column },
        source: options.source
      };

      whitespace();
      return node;
    }
  }

  /**
   * Return `node`.
   */

  function positionNoop(node) {
    whitespace();
    return node;
  }

  /**
   * Error `msg`.
   */

  function error(msg) {
    var err = new Error(msg + ' near line ' + lineno + ':' + column);
    err.line = lineno;
    err.column = column;
    err.source = css;
    throw err;
  }

  /**
   * Parse stylesheet.
   */

  function stylesheet() {
    return {
      type: 'stylesheet',
      stylesheet: {
        rules: rules()
      }
    };
  }

  /**
   * Opening brace.
   */

  function open() {
    return match(/^{\s*/);
  }

  /**
   * Closing brace.
   */

  function close() {
    return match(/^}/);
  }

  /**
   * Parse ruleset.
   */

  function rules() {
    var node;
    var rules = [];
    whitespace();
    comments(rules);
    while (css.charAt(0) != '}' && (node = atrule() || rule())) {
      rules.push(node);
      comments(rules);
    }
    return rules;
  }

  /**
   * Match `re` and return captures.
   */

  function match(re) {
    var m = re.exec(css);
    if (!m) return;
    var str = m[0];
    updatePosition(str);
    css = css.slice(str.length);
    return m;
  }

  /**
   * Parse whitespace.
   */

  function whitespace() {
    match(/^\s*/);
  }

  /**
   * Parse comments;
   */

  function comments(rules) {
    var c;
    rules = rules || [];
    while (c = comment()) rules.push(c);
    return rules;
  }

  /**
   * Parse comment.
   */

  function comment() {
    var pos = position();
    if ('/' != css.charAt(0) || '*' != css.charAt(1)) return;

    var i = 2;
    while (null != css.charAt(i) && ('*' != css.charAt(i) || '/' != css.charAt(i + 1))) ++i;
    i += 2;

    var str = css.slice(2, i - 2);
    column += 2;
    updatePosition(str);
    css = css.slice(i);
    column += 2;

    return pos({
      type: 'comment',
      comment: str
    });
  }

  /**
   * Parse selector.
   */

  function selector() {
    var m = match(/^([^{]+)/);
    if (!m) return;
    return trim(m[0]).split(/\s*,\s*/);
  }

  /**
   * Parse declaration.
   */

  function declaration() {
    var pos = position();

    // prop
    var prop = match(/^(\*?[-\/\*\w]+(\[[0-9a-z_-]+\])?)\s*/);
    if (!prop) return;
    prop = trim(prop[0]);

    // :
    if (!match(/^:\s*/)) return error("property missing ':'");

    // val
    var val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);
    if (!val) return error('property missing value');

    var ret = pos({
      type: 'declaration',
      property: prop,
      value: trim(val[0])
    });

    // ;
    match(/^[;\s]*/);

    return ret;
  }

  /**
   * Parse declarations.
   */

  function declarations() {
    var decls = [];

    if (!open()) return error("missing '{'");
    comments(decls);

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      comments(decls);
    }

    if (!close()) return error("missing '}'");
    return decls;
  }

  /**
   * Parse keyframe.
   */

  function keyframe() {
    var m;
    var vals = [];
    var pos = position();

    while (m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/)) {
      vals.push(m[1]);
      match(/^,\s*/);
    }

    if (!vals.length) return;

    return pos({
      type: 'keyframe',
      values: vals,
      declarations: declarations()
    });
  }

  /**
   * Parse keyframes.
   */

  function atkeyframes() {
    var pos = position();
    var m = match(/^@([-\w]+)?keyframes */);

    if (!m) return;
    var vendor = m[1];

    // identifier
    var m = match(/^([-\w]+)\s*/);
    if (!m) return error("@keyframes missing name");
    var name = m[1];

    if (!open()) return error("@keyframes missing '{'");

    var frame;
    var frames = comments();
    while (frame = keyframe()) {
      frames.push(frame);
      frames = frames.concat(comments());
    }

    if (!close()) return error("@keyframes missing '}'");

    return pos({
      type: 'keyframes',
      name: name,
      vendor: vendor,
      keyframes: frames
    });
  }

  /**
   * Parse supports.
   */

  function atsupports() {
    var pos = position();
    var m = match(/^@supports *([^{]+)/);

    if (!m) return;
    var supports = trim(m[1]);

    if (!open()) return error("@supports missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@supports missing '}'");

    return pos({
      type: 'supports',
      supports: supports,
      rules: style
    });
  }

  /**
   * Parse host.
   */

  function athost() {
    var pos = position();
    var m = match(/^@host */);

    if (!m) return;

    if (!open()) return error("@host missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@host missing '}'");

    return pos({
      type: 'host',
      rules: style
    });
  }

  /**
   * Parse media.
   */

  function atmedia() {
    var pos = position();
    var m = match(/^@media *([^{]+)/);

    if (!m) return;
    var media = trim(m[1]);

    if (!open()) return error("@media missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@media missing '}'");

    return pos({
      type: 'media',
      media: media,
      rules: style
    });
  }

  /**
   * Parse paged media.
   */

  function atpage() {
    var pos = position();
    var m = match(/^@page */);
    if (!m) return;

    var sel = selector() || [];

    if (!open()) return error("@page missing '{'");
    var decls = comments();

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      decls = decls.concat(comments());
    }

    if (!close()) return error("@page missing '}'");

    return pos({
      type: 'page',
      selectors: sel,
      declarations: decls
    });
  }

  /**
   * Parse document.
   */

  function atdocument() {
    var pos = position();
    var m = match(/^@([-\w]+)?document *([^{]+)/);
    if (!m) return;

    var vendor = trim(m[1]);
    var doc = trim(m[2]);

    if (!open()) return error("@document missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@document missing '}'");

    return pos({
      type: 'document',
      document: doc,
      vendor: vendor,
      rules: style
    });
  }

  /**
   * Parse import
   */

  function atimport() {
    return _atrule('import');
  }

  /**
   * Parse charset
   */

  function atcharset() {
    return _atrule('charset');
  }

  /**
   * Parse namespace
   */

  function atnamespace() {
    return _atrule('namespace')
  }

  /**
   * Parse non-block at-rules
   */

  function _atrule(name) {
    var pos = position();
    var m = match(new RegExp('^@' + name + ' *([^;\\n]+);'));
    if (!m) return;
    var ret = { type: name };
    ret[name] = trim(m[1]);
    return pos(ret);
  }

  /**
   * Parse at rule.
   */

  function atrule() {
    return atkeyframes()
      || atmedia()
      || atsupports()
      || atimport()
      || atcharset()
      || atnamespace()
      || atdocument()
      || atpage()
      || athost();
  }

  /**
   * Parse rule.
   */

  function rule() {
    var pos = position();
    var sel = selector();

    if (!sel) return;
    comments();

    return pos({
      type: 'rule',
      selectors: sel,
      declarations: declarations()
    });
  }

  return stylesheet();
};

/**
 * Trim `str`.
 */

function trim(str) {
  return (str || '').replace(/^\s+|\s+$/g, '');
}

},{}],41:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var Compressed = _dereq_('./lib/compress');
var Identity = _dereq_('./lib/identity');

/**
 * Stringfy the given AST `node`.
 *
 * Options:
 *
 *  - `compress` space-optimized output
 *  - `sourcemap` return an object with `.code` and `.map`
 *
 * @param {Object} node
 * @param {Object} [options]
 * @return {String}
 * @api public
 */

module.exports = function(node, options){
  options = options || {};

  var compiler = options.compress
    ? new Compressed(options)
    : new Identity(options);

  // source maps
  if (options.sourcemap) {
    var sourcemaps = _dereq_('./lib/source-map-support');
    sourcemaps(compiler);

    var code = compiler.compile(node);
    return { code: code, map: compiler.map.toJSON() };
  }

  var code = compiler.compile(node);
  return code;
};


},{"./lib/compress":43,"./lib/identity":44,"./lib/source-map-support":45}],42:[function(_dereq_,module,exports){

/**
 * Expose `Compiler`.
 */

module.exports = Compiler;

/**
 * Initialize a compiler.
 *
 * @param {Type} name
 * @return {Type}
 * @api public
 */

function Compiler(opts) {
  this.options = opts || {};
}

/**
 * Emit `str`
 */

Compiler.prototype.emit = function(str) {
  return str;
};

/**
 * Visit `node`.
 */

Compiler.prototype.visit = function(node){
  return this[node.type](node);
};

/**
 * Map visit over array of `nodes`, optionally using a `delim`
 */

Compiler.prototype.mapVisit = function(nodes, delim){
  var buf = '';
  delim = delim || '';

  for (var i = 0, length = nodes.length; i < length; i++) {
    buf += this.visit(nodes[i]);
    if (delim && i < length - 1) buf += this.emit(delim);
  }

  return buf;
};

},{}],43:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var Base = _dereq_('./compiler');

/**
 * Expose compiler.
 */

module.exports = Compiler;

/**
 * Initialize a new `Compiler`.
 */

function Compiler(options) {
  Base.call(this, options);
}

/**
 * Inherit from `Base.prototype`.
 */

Compiler.prototype.__proto__ = Base.prototype;

/**
 * Compile `node`.
 */

Compiler.prototype.compile = function(node){
  return node.stylesheet
    .rules.map(this.visit, this)
    .join('');
};

/**
 * Visit comment node.
 */

Compiler.prototype.comment = function(node){
  return this.emit('', node.position);
};

/**
 * Visit import node.
 */

Compiler.prototype.import = function(node){
  return this.emit('@import ' + node.import + ';', node.position);
};

/**
 * Visit media node.
 */

Compiler.prototype.media = function(node){
  return this.emit('@media ' + node.media, node.position, true)
    + this.emit('{')
    + this.mapVisit(node.rules)
    + this.emit('}');
};

/**
 * Visit document node.
 */

Compiler.prototype.document = function(node){
  var doc = '@' + (node.vendor || '') + 'document ' + node.document;

  return this.emit(doc, node.position, true)
    + this.emit('{')
    + this.mapVisit(node.rules)
    + this.emit('}');
};

/**
 * Visit charset node.
 */

Compiler.prototype.charset = function(node){
  return this.emit('@charset ' + node.charset + ';', node.position);
};

/**
 * Visit namespace node.
 */

Compiler.prototype.namespace = function(node){
  return this.emit('@namespace ' + node.namespace + ';', node.position);
};

/**
 * Visit supports node.
 */

Compiler.prototype.supports = function(node){
  return this.emit('@supports ' + node.supports, node.position, true)
    + this.emit('{')
    + this.mapVisit(node.rules)
    + this.emit('}');
};

/**
 * Visit keyframes node.
 */

Compiler.prototype.keyframes = function(node){
  return this.emit('@'
    + (node.vendor || '')
    + 'keyframes '
    + node.name, node.position, true)
    + this.emit('{')
    + this.mapVisit(node.keyframes)
    + this.emit('}');
};

/**
 * Visit keyframe node.
 */

Compiler.prototype.keyframe = function(node){
  var decls = node.declarations;

  return this.emit(node.values.join(','), node.position, true)
    + this.emit('{')
    + this.mapVisit(decls)
    + this.emit('}');
};

/**
 * Visit page node.
 */

Compiler.prototype.page = function(node){
  var sel = node.selectors.length
    ? node.selectors.join(', ')
    : '';

  return this.emit('@page ' + sel, node.position, true)
    + this.emit('{')
    + this.mapVisit(node.declarations)
    + this.emit('}');
};

/**
 * Visit rule node.
 */

Compiler.prototype.rule = function(node){
  var decls = node.declarations;
  if (!decls.length) return '';

  return this.emit(node.selectors.join(','), node.position, true)
    + this.emit('{')
    + this.mapVisit(decls)
    + this.emit('}');
};

/**
 * Visit declaration node.
 */

Compiler.prototype.declaration = function(node){
  return this.emit(node.property + ':' + node.value, node.position) + this.emit(';');
};


},{"./compiler":42}],44:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var Base = _dereq_('./compiler');

/**
 * Expose compiler.
 */

module.exports = Compiler;

/**
 * Initialize a new `Compiler`.
 */

function Compiler(options) {
  options = options || {};
  Base.call(this, options);
  this.indentation = options.indent;
}

/**
 * Inherit from `Base.prototype`.
 */

Compiler.prototype.__proto__ = Base.prototype;

/**
 * Compile `node`.
 */

Compiler.prototype.compile = function(node){
  return this.stylesheet(node);
};

/**
 * Visit stylesheet node.
 */

Compiler.prototype.stylesheet = function(node){
  return this.mapVisit(node.stylesheet.rules, '\n\n');
};

/**
 * Visit comment node.
 */

Compiler.prototype.comment = function(node){
  return this.emit(this.indent() + '/*' + node.comment + '*/', node.position);
};

/**
 * Visit import node.
 */

Compiler.prototype.import = function(node){
  return this.emit('@import ' + node.import + ';', node.position);
};

/**
 * Visit media node.
 */

Compiler.prototype.media = function(node){
  return this.emit('@media ' + node.media, node.position, true)
    + this.emit(
        ' {\n'
        + this.indent(1))
    + this.mapVisit(node.rules, '\n\n')
    + this.emit(
        this.indent(-1)
        + '\n}');
};

/**
 * Visit document node.
 */

Compiler.prototype.document = function(node){
  var doc = '@' + (node.vendor || '') + 'document ' + node.document;

  return this.emit(doc, node.position, true)
    + this.emit(
        ' '
      + ' {\n'
      + this.indent(1))
    + this.mapVisit(node.rules, '\n\n')
    + this.emit(
        this.indent(-1)
        + '\n}');
};

/**
 * Visit charset node.
 */

Compiler.prototype.charset = function(node){
  return this.emit('@charset ' + node.charset + ';', node.position);
};

/**
 * Visit namespace node.
 */

Compiler.prototype.namespace = function(node){
  return this.emit('@namespace ' + node.namespace + ';', node.position);
};

/**
 * Visit supports node.
 */

Compiler.prototype.supports = function(node){
  return this.emit('@supports ' + node.supports, node.position, true)
    + this.emit(
      ' {\n'
      + this.indent(1))
    + this.mapVisit(node.rules, '\n\n')
    + this.emit(
        this.indent(-1)
        + '\n}');
};

/**
 * Visit keyframes node.
 */

Compiler.prototype.keyframes = function(node){
  return this.emit('@' + (node.vendor || '') + 'keyframes ' + node.name, node.position, true)
    + this.emit(
      ' {\n'
      + this.indent(1))
    + this.mapVisit(node.keyframes, '\n')
    + this.emit(
        this.indent(-1)
        + '}');
};

/**
 * Visit keyframe node.
 */

Compiler.prototype.keyframe = function(node){
  var decls = node.declarations;

  return this.emit(this.indent())
    + this.emit(node.values.join(', '), node.position, true)
    + this.emit(
      ' {\n'
      + this.indent(1))
    + this.mapVisit(decls, '\n')
    + this.emit(
      this.indent(-1)
      + '\n'
      + this.indent() + '}\n');
};

/**
 * Visit page node.
 */

Compiler.prototype.page = function(node){
  var sel = node.selectors.length
    ? node.selectors.join(', ') + ' '
    : '';

  return this.emit('@page ' + sel, node.position, true)
    + this.emit('{\n')
    + this.emit(this.indent(1))
    + this.mapVisit(node.declarations, '\n')
    + this.emit(this.indent(-1))
    + this.emit('\n}');
};

/**
 * Visit rule node.
 */

Compiler.prototype.rule = function(node){
  var indent = this.indent();
  var decls = node.declarations;
  if (!decls.length) return '';

  return this.emit(node.selectors.map(function(s){ return indent + s }).join(',\n'), node.position, true)
    + this.emit(' {\n')
    + this.emit(this.indent(1))
    + this.mapVisit(decls, '\n')
    + this.emit(this.indent(-1))
    + this.emit('\n' + this.indent() + '}');
};

/**
 * Visit declaration node.
 */

Compiler.prototype.declaration = function(node){
  return this.emit(this.indent())
    + this.emit(node.property + ': ' + node.value, node.position)
    + this.emit(';');
};

/**
 * Increase, decrease or return current indentation.
 */

Compiler.prototype.indent = function(level) {
  this.level = this.level || 1;

  if (null != level) {
    this.level += level;
    return '';
  }

  return Array(this.level).join(this.indentation || '  ');
};

},{"./compiler":42}],45:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var SourceMap = _dereq_('source-map').SourceMapGenerator;

/**
 * Expose `mixin()`.
 */

module.exports = mixin;

/**
 * Mixin source map support into `compiler`.
 *
 * @param {Compiler} compiler
 * @api public
 */

function mixin(compiler) {
  var file = compiler.options.filename || 'generated.css';
  compiler.map = new SourceMap({ file: file });
  compiler.position = { line: 1, column: 1 };
  for (var k in exports) compiler[k] = exports[k];
}

/**
 * Update position.
 *
 * @param {String} str
 * @api private
 */

exports.updatePosition = function(str) {
  var lines = str.match(/\n/g);
  if (lines) this.position.line += lines.length;
  var i = str.lastIndexOf('\n');
  this.position.column = ~i ? str.length - i : this.position.column + str.length;
};

/**
 * Emit `str`.
 *
 * @param {String} str
 * @param {Number} [pos]
 * @param {Boolean} [startOnly]
 * @return {String}
 * @api private
 */

exports.emit = function(str, pos, startOnly) {
  if (pos && pos.start) {
    this.map.addMapping({
      source: pos.source || 'source.css',
      generated: {
        line: this.position.line,
        column: Math.max(this.position.column - 1, 0)
      },
      original: {
        line: pos.start.line,
        column: pos.start.column - 1
      }
    });
  }

  this.updatePosition(str);

  if (!startOnly && pos && pos.end) {
    this.map.addMapping({
      source: pos.source || 'source.css',
      generated: {
        line: this.position.line,
        column: Math.max(this.position.column - 1, 0)
      },
      original: {
        line: pos.end.line,
        column: pos.end.column - 1
      }
    });
  }

  return str;
};

},{"source-map":46}],46:[function(_dereq_,module,exports){
/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = _dereq_('./source-map/source-map-generator').SourceMapGenerator;
exports.SourceMapConsumer = _dereq_('./source-map/source-map-consumer').SourceMapConsumer;
exports.SourceNode = _dereq_('./source-map/source-node').SourceNode;

},{"./source-map/source-map-consumer":51,"./source-map/source-map-generator":52,"./source-map/source-node":53}],47:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

  var util = _dereq_('./util');

  /**
   * A data structure which is a combination of an array and a set. Adding a new
   * member is O(1), testing for membership is O(1), and finding the index of an
   * element is O(1). Removing elements from the set is not supported. Only
   * strings are supported for membership.
   */
  function ArraySet() {
    this._array = [];
    this._set = {};
  }

  /**
   * Static method for creating ArraySet instances from an existing array.
   */
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };

  /**
   * Add the given string to this set.
   *
   * @param String aStr
   */
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var isDuplicate = this.has(aStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      this._set[util.toSetString(aStr)] = idx;
    }
  };

  /**
   * Is the given string a member of this set?
   *
   * @param String aStr
   */
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    return Object.prototype.hasOwnProperty.call(this._set,
                                                util.toSetString(aStr));
  };

  /**
   * What is the index of the given string in the array?
   *
   * @param String aStr
   */
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (this.has(aStr)) {
      return this._set[util.toSetString(aStr)];
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };

  /**
   * What is the element at the given index?
   *
   * @param Number aIdx
   */
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error('No element indexed by ' + aIdx);
  };

  /**
   * Returns the array representation of this set (which has the proper indices
   * indicated by indexOf). Note that this is a copy of the internal array used
   * for storing the members so that no one can mess with internal state.
   */
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };

  exports.ArraySet = ArraySet;

});

},{"./util":54,"amdefine":55}],48:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

  var base64 = _dereq_('./base64');

  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
  // length quantities we use in the source map spec, the first bit is the sign,
  // the next four bits are the actual value, and the 6th bit is the
  // continuation bit. The continuation bit tells us whether there are more
  // digits in this value following this digit.
  //
  //   Continuation
  //   |    Sign
  //   |    |
  //   V    V
  //   101011

  var VLQ_BASE_SHIFT = 5;

  // binary: 100000
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

  // binary: 011111
  var VLQ_BASE_MASK = VLQ_BASE - 1;

  // binary: 100000
  var VLQ_CONTINUATION_BIT = VLQ_BASE;

  /**
   * Converts from a two-complement value to a value where the sign bit is
   * is placed in the least significant bit.  For example, as decimals:
   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
   */
  function toVLQSigned(aValue) {
    return aValue < 0
      ? ((-aValue) << 1) + 1
      : (aValue << 1) + 0;
  }

  /**
   * Converts to a two-complement value from a value where the sign bit is
   * is placed in the least significant bit.  For example, as decimals:
   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
   */
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative
      ? -shifted
      : shifted;
  }

  /**
   * Returns the base 64 VLQ encoded value.
   */
  exports.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;

    var vlq = toVLQSigned(aValue);

    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        // There are still more digits in this value, so we must make sure the
        // continuation bit is marked.
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base64.encode(digit);
    } while (vlq > 0);

    return encoded;
  };

  /**
   * Decodes the next base 64 VLQ value from the given string and returns the
   * value and the rest of the string.
   */
  exports.decode = function base64VLQ_decode(aStr) {
    var i = 0;
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;

    do {
      if (i >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base64.decode(aStr.charAt(i++));
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);

    return {
      value: fromVLQSigned(result),
      rest: aStr.slice(i)
    };
  };

});

},{"./base64":49,"amdefine":55}],49:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

  var charToIntMap = {};
  var intToCharMap = {};

  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    .split('')
    .forEach(function (ch, index) {
      charToIntMap[ch] = index;
      intToCharMap[index] = ch;
    });

  /**
   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
   */
  exports.encode = function base64_encode(aNumber) {
    if (aNumber in intToCharMap) {
      return intToCharMap[aNumber];
    }
    throw new TypeError("Must be between 0 and 63: " + aNumber);
  };

  /**
   * Decode a single base 64 digit to an integer.
   */
  exports.decode = function base64_decode(aChar) {
    if (aChar in charToIntMap) {
      return charToIntMap[aChar];
    }
    throw new TypeError("Not a valid base 64 digit: " + aChar);
  };

});

},{"amdefine":55}],50:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

  /**
   * Recursive implementation of binary search.
   *
   * @param aLow Indices here and lower do not contain the needle.
   * @param aHigh Indices here and higher do not contain the needle.
   * @param aNeedle The element being searched for.
   * @param aHaystack The non-empty array being searched.
   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
   */
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare) {
    // This function terminates when one of the following is true:
    //
    //   1. We find the exact element we are looking for.
    //
    //   2. We did not find the exact element, but we can return the next
    //      closest element that is less than that element.
    //
    //   3. We did not find the exact element, and there is no next-closest
    //      element which is less than the one we are searching for, so we
    //      return null.
    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
    var cmp = aCompare(aNeedle, aHaystack[mid], true);
    if (cmp === 0) {
      // Found the element we are looking for.
      return aHaystack[mid];
    }
    else if (cmp > 0) {
      // aHaystack[mid] is greater than our needle.
      if (aHigh - mid > 1) {
        // The element is in the upper half.
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
      }
      // We did not find an exact match, return the next closest one
      // (termination case 2).
      return aHaystack[mid];
    }
    else {
      // aHaystack[mid] is less than our needle.
      if (mid - aLow > 1) {
        // The element is in the lower half.
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
      }
      // The exact needle element was not found in this haystack. Determine if
      // we are in termination case (2) or (3) and return the appropriate thing.
      return aLow < 0
        ? null
        : aHaystack[aLow];
    }
  }

  /**
   * This is an implementation of binary search which will always try and return
   * the next lowest value checked if there is no exact hit. This is because
   * mappings between original and generated line/col pairs are single points,
   * and there is an implicit region between each of them, so a miss just means
   * that you aren't on the very start of a region.
   *
   * @param aNeedle The element you are looking for.
   * @param aHaystack The array that is being searched.
   * @param aCompare A function which takes the needle and an element in the
   *     array and returns -1, 0, or 1 depending on whether the needle is less
   *     than, equal to, or greater than the element, respectively.
   */
  exports.search = function search(aNeedle, aHaystack, aCompare) {
    return aHaystack.length > 0
      ? recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare)
      : null;
  };

});

},{"amdefine":55}],51:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

  var util = _dereq_('./util');
  var binarySearch = _dereq_('./binary-search');
  var ArraySet = _dereq_('./array-set').ArraySet;
  var base64VLQ = _dereq_('./base64-vlq');

  /**
   * A SourceMapConsumer instance represents a parsed source map which we can
   * query for information about the original file positions by giving it a file
   * position in the generated source.
   *
   * The only parameter is the raw source map (either as a JSON string, or
   * already parsed to an object). According to the spec, source maps have the
   * following attributes:
   *
   *   - version: Which version of the source map spec this map is following.
   *   - sources: An array of URLs to the original source files.
   *   - names: An array of identifiers which can be referrenced by individual mappings.
   *   - sourceRoot: Optional. The URL root from which all sources are relative.
   *   - sourcesContent: Optional. An array of contents of the original source files.
   *   - mappings: A string of base64 VLQs which contain the actual mappings.
   *   - file: Optional. The generated file this source map is associated with.
   *
   * Here is an example source map, taken from the source map spec[0]:
   *
   *     {
   *       version : 3,
   *       file: "out.js",
   *       sourceRoot : "",
   *       sources: ["foo.js", "bar.js"],
   *       names: ["src", "maps", "are", "fun"],
   *       mappings: "AA,AB;;ABCDE;"
   *     }
   *
   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
   */
  function SourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
    }

    var version = util.getArg(sourceMap, 'version');
    var sources = util.getArg(sourceMap, 'sources');
    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
    // requires the array) to play nice here.
    var names = util.getArg(sourceMap, 'names', []);
    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
    var mappings = util.getArg(sourceMap, 'mappings');
    var file = util.getArg(sourceMap, 'file', null);

    // Once again, Sass deviates from the spec and supplies the version as a
    // string rather than a number, so we use loose equality checking here.
    if (version != this._version) {
      throw new Error('Unsupported version: ' + version);
    }

    // Pass `true` below to allow duplicate names and sources. While source maps
    // are intended to be compressed and deduplicated, the TypeScript compiler
    // sometimes generates source maps with duplicates in them. See Github issue
    // #72 and bugzil.la/889492.
    this._names = ArraySet.fromArray(names, true);
    this._sources = ArraySet.fromArray(sources, true);

    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this.file = file;
  }

  /**
   * Create a SourceMapConsumer from a SourceMapGenerator.
   *
   * @param SourceMapGenerator aSourceMap
   *        The source map that will be consumed.
   * @returns SourceMapConsumer
   */
  SourceMapConsumer.fromSourceMap =
    function SourceMapConsumer_fromSourceMap(aSourceMap) {
      var smc = Object.create(SourceMapConsumer.prototype);

      smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
      smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
      smc.sourceRoot = aSourceMap._sourceRoot;
      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                              smc.sourceRoot);
      smc.file = aSourceMap._file;

      smc.__generatedMappings = aSourceMap._mappings.slice()
        .sort(util.compareByGeneratedPositions);
      smc.__originalMappings = aSourceMap._mappings.slice()
        .sort(util.compareByOriginalPositions);

      return smc;
    };

  /**
   * The version of the source mapping spec that we are consuming.
   */
  SourceMapConsumer.prototype._version = 3;

  /**
   * The list of original sources.
   */
  Object.defineProperty(SourceMapConsumer.prototype, 'sources', {
    get: function () {
      return this._sources.toArray().map(function (s) {
        return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
      }, this);
    }
  });

  // `__generatedMappings` and `__originalMappings` are arrays that hold the
  // parsed mapping coordinates from the source map's "mappings" attribute. They
  // are lazily instantiated, accessed via the `_generatedMappings` and
  // `_originalMappings` getters respectively, and we only parse the mappings
  // and create these arrays once queried for a source location. We jump through
  // these hoops because there can be many thousands of mappings, and parsing
  // them is expensive, so we only want to do it if we must.
  //
  // Each object in the arrays is of the form:
  //
  //     {
  //       generatedLine: The line number in the generated code,
  //       generatedColumn: The column number in the generated code,
  //       source: The path to the original source file that generated this
  //               chunk of code,
  //       originalLine: The line number in the original source that
  //                     corresponds to this chunk of generated code,
  //       originalColumn: The column number in the original source that
  //                       corresponds to this chunk of generated code,
  //       name: The name of the original symbol which generated this chunk of
  //             code.
  //     }
  //
  // All properties except for `generatedLine` and `generatedColumn` can be
  // `null`.
  //
  // `_generatedMappings` is ordered by the generated positions.
  //
  // `_originalMappings` is ordered by the original positions.

  SourceMapConsumer.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
    get: function () {
      if (!this.__generatedMappings) {
        this.__generatedMappings = [];
        this.__originalMappings = [];
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__generatedMappings;
    }
  });

  SourceMapConsumer.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
    get: function () {
      if (!this.__originalMappings) {
        this.__generatedMappings = [];
        this.__originalMappings = [];
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__originalMappings;
    }
  });

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  SourceMapConsumer.prototype._parseMappings =
    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      var generatedLine = 1;
      var previousGeneratedColumn = 0;
      var previousOriginalLine = 0;
      var previousOriginalColumn = 0;
      var previousSource = 0;
      var previousName = 0;
      var mappingSeparator = /^[,;]/;
      var str = aStr;
      var mapping;
      var temp;

      while (str.length > 0) {
        if (str.charAt(0) === ';') {
          generatedLine++;
          str = str.slice(1);
          previousGeneratedColumn = 0;
        }
        else if (str.charAt(0) === ',') {
          str = str.slice(1);
        }
        else {
          mapping = {};
          mapping.generatedLine = generatedLine;

          // Generated column.
          temp = base64VLQ.decode(str);
          mapping.generatedColumn = previousGeneratedColumn + temp.value;
          previousGeneratedColumn = mapping.generatedColumn;
          str = temp.rest;

          if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
            // Original source.
            temp = base64VLQ.decode(str);
            mapping.source = this._sources.at(previousSource + temp.value);
            previousSource += temp.value;
            str = temp.rest;
            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
              throw new Error('Found a source, but no line and column');
            }

            // Original line.
            temp = base64VLQ.decode(str);
            mapping.originalLine = previousOriginalLine + temp.value;
            previousOriginalLine = mapping.originalLine;
            // Lines are stored 0-based
            mapping.originalLine += 1;
            str = temp.rest;
            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
              throw new Error('Found a source and line, but no column');
            }

            // Original column.
            temp = base64VLQ.decode(str);
            mapping.originalColumn = previousOriginalColumn + temp.value;
            previousOriginalColumn = mapping.originalColumn;
            str = temp.rest;

            if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
              // Original name.
              temp = base64VLQ.decode(str);
              mapping.name = this._names.at(previousName + temp.value);
              previousName += temp.value;
              str = temp.rest;
            }
          }

          this.__generatedMappings.push(mapping);
          if (typeof mapping.originalLine === 'number') {
            this.__originalMappings.push(mapping);
          }
        }
      }

      this.__generatedMappings.sort(util.compareByGeneratedPositions);
      this.__originalMappings.sort(util.compareByOriginalPositions);
    };

  /**
   * Find the mapping that best matches the hypothetical "needle" mapping that
   * we are searching for in the given "haystack" of mappings.
   */
  SourceMapConsumer.prototype._findMapping =
    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                           aColumnName, aComparator) {
      // To return the position we are searching for, we must first find the
      // mapping for the given position and then return the opposite position it
      // points to. Because the mappings are sorted, we can use binary search to
      // find the best mapping.

      if (aNeedle[aLineName] <= 0) {
        throw new TypeError('Line must be greater than or equal to 1, got '
                            + aNeedle[aLineName]);
      }
      if (aNeedle[aColumnName] < 0) {
        throw new TypeError('Column must be greater than or equal to 0, got '
                            + aNeedle[aColumnName]);
      }

      return binarySearch.search(aNeedle, aMappings, aComparator);
    };

  /**
   * Returns the original source, line, and column information for the generated
   * source's line and column positions provided. The only argument is an object
   * with the following properties:
   *
   *   - line: The line number in the generated source.
   *   - column: The column number in the generated source.
   *
   * and an object is returned with the following properties:
   *
   *   - source: The original source file, or null.
   *   - line: The line number in the original source, or null.
   *   - column: The column number in the original source, or null.
   *   - name: The original identifier, or null.
   */
  SourceMapConsumer.prototype.originalPositionFor =
    function SourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, 'line'),
        generatedColumn: util.getArg(aArgs, 'column')
      };

      var mapping = this._findMapping(needle,
                                      this._generatedMappings,
                                      "generatedLine",
                                      "generatedColumn",
                                      util.compareByGeneratedPositions);

      if (mapping && mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source != null && this.sourceRoot != null) {
          source = util.join(this.sourceRoot, source);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: util.getArg(mapping, 'name', null)
        };
      }

      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    };

  /**
   * Returns the original source content. The only argument is the url of the
   * original source file. Returns null if no original source content is
   * availible.
   */
  SourceMapConsumer.prototype.sourceContentFor =
    function SourceMapConsumer_sourceContentFor(aSource) {
      if (!this.sourcesContent) {
        return null;
      }

      if (this.sourceRoot != null) {
        aSource = util.relative(this.sourceRoot, aSource);
      }

      if (this._sources.has(aSource)) {
        return this.sourcesContent[this._sources.indexOf(aSource)];
      }

      var url;
      if (this.sourceRoot != null
          && (url = util.urlParse(this.sourceRoot))) {
        // XXX: file:// URIs and absolute paths lead to unexpected behavior for
        // many users. We can help them out when they expect file:// URIs to
        // behave like it would if they were running a local HTTP server. See
        // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
        var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
        if (url.scheme == "file"
            && this._sources.has(fileUriAbsPath)) {
          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
        }

        if ((!url.path || url.path == "/")
            && this._sources.has("/" + aSource)) {
          return this.sourcesContent[this._sources.indexOf("/" + aSource)];
        }
      }

      throw new Error('"' + aSource + '" is not in the SourceMap.');
    };

  /**
   * Returns the generated line and column information for the original source,
   * line, and column positions provided. The only argument is an object with
   * the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.
   *   - column: The column number in the original source.
   *
   * and an object is returned with the following properties:
   *
   *   - line: The line number in the generated source, or null.
   *   - column: The column number in the generated source, or null.
   */
  SourceMapConsumer.prototype.generatedPositionFor =
    function SourceMapConsumer_generatedPositionFor(aArgs) {
      var needle = {
        source: util.getArg(aArgs, 'source'),
        originalLine: util.getArg(aArgs, 'line'),
        originalColumn: util.getArg(aArgs, 'column')
      };

      if (this.sourceRoot != null) {
        needle.source = util.relative(this.sourceRoot, needle.source);
      }

      var mapping = this._findMapping(needle,
                                      this._originalMappings,
                                      "originalLine",
                                      "originalColumn",
                                      util.compareByOriginalPositions);

      if (mapping) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null)
        };
      }

      return {
        line: null,
        column: null
      };
    };

  SourceMapConsumer.GENERATED_ORDER = 1;
  SourceMapConsumer.ORIGINAL_ORDER = 2;

  /**
   * Iterate over each mapping between an original source/line/column and a
   * generated line/column in this source map.
   *
   * @param Function aCallback
   *        The function that is called with each mapping.
   * @param Object aContext
   *        Optional. If specified, this object will be the value of `this` every
   *        time that `aCallback` is called.
   * @param aOrder
   *        Either `SourceMapConsumer.GENERATED_ORDER` or
   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
   *        iterate over the mappings sorted by the generated file's line/column
   *        order or the original's source/line/column order, respectively. Defaults to
   *        `SourceMapConsumer.GENERATED_ORDER`.
   */
  SourceMapConsumer.prototype.eachMapping =
    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
      var context = aContext || null;
      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

      var mappings;
      switch (order) {
      case SourceMapConsumer.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
      }

      var sourceRoot = this.sourceRoot;
      mappings.map(function (mapping) {
        var source = mapping.source;
        if (source != null && sourceRoot != null) {
          source = util.join(sourceRoot, source);
        }
        return {
          source: source,
          generatedLine: mapping.generatedLine,
          generatedColumn: mapping.generatedColumn,
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: mapping.name
        };
      }).forEach(aCallback, context);
    };

  exports.SourceMapConsumer = SourceMapConsumer;

});

},{"./array-set":47,"./base64-vlq":48,"./binary-search":50,"./util":54,"amdefine":55}],52:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

  var base64VLQ = _dereq_('./base64-vlq');
  var util = _dereq_('./util');
  var ArraySet = _dereq_('./array-set').ArraySet;

  /**
   * An instance of the SourceMapGenerator represents a source map which is
   * being built incrementally. You may pass an object with the following
   * properties:
   *
   *   - file: The filename of the generated source.
   *   - sourceRoot: A root for all relative URLs in this source map.
   */
  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util.getArg(aArgs, 'file', null);
    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = [];
    this._sourcesContents = null;
  }

  SourceMapGenerator.prototype._version = 3;

  /**
   * Creates a new SourceMapGenerator based on a SourceMapConsumer
   *
   * @param aSourceMapConsumer The SourceMap.
   */
  SourceMapGenerator.fromSourceMap =
    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
      var sourceRoot = aSourceMapConsumer.sourceRoot;
      var generator = new SourceMapGenerator({
        file: aSourceMapConsumer.file,
        sourceRoot: sourceRoot
      });
      aSourceMapConsumer.eachMapping(function (mapping) {
        var newMapping = {
          generated: {
            line: mapping.generatedLine,
            column: mapping.generatedColumn
          }
        };

        if (mapping.source != null) {
          newMapping.source = mapping.source;
          if (sourceRoot != null) {
            newMapping.source = util.relative(sourceRoot, newMapping.source);
          }

          newMapping.original = {
            line: mapping.originalLine,
            column: mapping.originalColumn
          };

          if (mapping.name != null) {
            newMapping.name = mapping.name;
          }
        }

        generator.addMapping(newMapping);
      });
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          generator.setSourceContent(sourceFile, content);
        }
      });
      return generator;
    };

  /**
   * Add a single mapping from original source line and column to the generated
   * source's line and column for this source map being created. The mapping
   * object should have the following properties:
   *
   *   - generated: An object with the generated line and column positions.
   *   - original: An object with the original line and column positions.
   *   - source: The original source file (relative to the sourceRoot).
   *   - name: An optional original token name for this mapping.
   */
  SourceMapGenerator.prototype.addMapping =
    function SourceMapGenerator_addMapping(aArgs) {
      var generated = util.getArg(aArgs, 'generated');
      var original = util.getArg(aArgs, 'original', null);
      var source = util.getArg(aArgs, 'source', null);
      var name = util.getArg(aArgs, 'name', null);

      this._validateMapping(generated, original, source, name);

      if (source != null && !this._sources.has(source)) {
        this._sources.add(source);
      }

      if (name != null && !this._names.has(name)) {
        this._names.add(name);
      }

      this._mappings.push({
        generatedLine: generated.line,
        generatedColumn: generated.column,
        originalLine: original != null && original.line,
        originalColumn: original != null && original.column,
        source: source,
        name: name
      });
    };

  /**
   * Set the source content for a source file.
   */
  SourceMapGenerator.prototype.setSourceContent =
    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
      var source = aSourceFile;
      if (this._sourceRoot != null) {
        source = util.relative(this._sourceRoot, source);
      }

      if (aSourceContent != null) {
        // Add the source content to the _sourcesContents map.
        // Create a new _sourcesContents map if the property is null.
        if (!this._sourcesContents) {
          this._sourcesContents = {};
        }
        this._sourcesContents[util.toSetString(source)] = aSourceContent;
      } else {
        // Remove the source file from the _sourcesContents map.
        // If the _sourcesContents map is empty, set the property to null.
        delete this._sourcesContents[util.toSetString(source)];
        if (Object.keys(this._sourcesContents).length === 0) {
          this._sourcesContents = null;
        }
      }
    };

  /**
   * Applies the mappings of a sub-source-map for a specific source file to the
   * source map being generated. Each mapping to the supplied source file is
   * rewritten using the supplied source map. Note: The resolution for the
   * resulting mappings is the minimium of this map and the supplied map.
   *
   * @param aSourceMapConsumer The source map to be applied.
   * @param aSourceFile Optional. The filename of the source file.
   *        If omitted, SourceMapConsumer's file property will be used.
   * @param aSourceMapPath Optional. The dirname of the path to the source map
   *        to be applied. If relative, it is relative to the SourceMapConsumer.
   *        This parameter is needed when the two source maps aren't in the same
   *        directory, and the source map to be applied contains relative source
   *        paths. If so, those relative source paths need to be rewritten
   *        relative to the SourceMapGenerator.
   */
  SourceMapGenerator.prototype.applySourceMap =
    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
      var sourceFile = aSourceFile;
      // If aSourceFile is omitted, we will use the file property of the SourceMap
      if (aSourceFile == null) {
        if (aSourceMapConsumer.file == null) {
          throw new Error(
            'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
            'or the source map\'s "file" property. Both were omitted.'
          );
        }
        sourceFile = aSourceMapConsumer.file;
      }
      var sourceRoot = this._sourceRoot;
      // Make "sourceFile" relative if an absolute Url is passed.
      if (sourceRoot != null) {
        sourceFile = util.relative(sourceRoot, sourceFile);
      }
      // Applying the SourceMap can add and remove items from the sources and
      // the names array.
      var newSources = new ArraySet();
      var newNames = new ArraySet();

      // Find mappings for the "sourceFile"
      this._mappings.forEach(function (mapping) {
        if (mapping.source === sourceFile && mapping.originalLine != null) {
          // Check if it can be mapped by the source map, then update the mapping.
          var original = aSourceMapConsumer.originalPositionFor({
            line: mapping.originalLine,
            column: mapping.originalColumn
          });
          if (original.source != null) {
            // Copy mapping
            mapping.source = original.source;
            if (aSourceMapPath != null) {
              mapping.source = util.join(aSourceMapPath, mapping.source)
            }
            if (sourceRoot != null) {
              mapping.source = util.relative(sourceRoot, mapping.source);
            }
            mapping.originalLine = original.line;
            mapping.originalColumn = original.column;
            if (original.name != null && mapping.name != null) {
              // Only use the identifier name if it's an identifier
              // in both SourceMaps
              mapping.name = original.name;
            }
          }
        }

        var source = mapping.source;
        if (source != null && !newSources.has(source)) {
          newSources.add(source);
        }

        var name = mapping.name;
        if (name != null && !newNames.has(name)) {
          newNames.add(name);
        }

      }, this);
      this._sources = newSources;
      this._names = newNames;

      // Copy sourcesContents of applied map.
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          if (aSourceMapPath != null) {
            sourceFile = util.join(aSourceMapPath, sourceFile);
          }
          if (sourceRoot != null) {
            sourceFile = util.relative(sourceRoot, sourceFile);
          }
          this.setSourceContent(sourceFile, content);
        }
      }, this);
    };

  /**
   * A mapping can have one of the three levels of data:
   *
   *   1. Just the generated position.
   *   2. The Generated position, original position, and original source.
   *   3. Generated and original position, original source, as well as a name
   *      token.
   *
   * To maintain consistency, we validate that any new mapping being added falls
   * in to one of these categories.
   */
  SourceMapGenerator.prototype._validateMapping =
    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                                aName) {
      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
          && aGenerated.line > 0 && aGenerated.column >= 0
          && !aOriginal && !aSource && !aName) {
        // Case 1.
        return;
      }
      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
               && aGenerated.line > 0 && aGenerated.column >= 0
               && aOriginal.line > 0 && aOriginal.column >= 0
               && aSource) {
        // Cases 2 and 3.
        return;
      }
      else {
        throw new Error('Invalid mapping: ' + JSON.stringify({
          generated: aGenerated,
          source: aSource,
          original: aOriginal,
          name: aName
        }));
      }
    };

  /**
   * Serialize the accumulated mappings in to the stream of base 64 VLQs
   * specified by the source map format.
   */
  SourceMapGenerator.prototype._serializeMappings =
    function SourceMapGenerator_serializeMappings() {
      var previousGeneratedColumn = 0;
      var previousGeneratedLine = 1;
      var previousOriginalColumn = 0;
      var previousOriginalLine = 0;
      var previousName = 0;
      var previousSource = 0;
      var result = '';
      var mapping;

      // The mappings must be guaranteed to be in sorted order before we start
      // serializing them or else the generated line numbers (which are defined
      // via the ';' separators) will be all messed up. Note: it might be more
      // performant to maintain the sorting as we insert them, rather than as we
      // serialize them, but the big O is the same either way.
      this._mappings.sort(util.compareByGeneratedPositions);

      for (var i = 0, len = this._mappings.length; i < len; i++) {
        mapping = this._mappings[i];

        if (mapping.generatedLine !== previousGeneratedLine) {
          previousGeneratedColumn = 0;
          while (mapping.generatedLine !== previousGeneratedLine) {
            result += ';';
            previousGeneratedLine++;
          }
        }
        else {
          if (i > 0) {
            if (!util.compareByGeneratedPositions(mapping, this._mappings[i - 1])) {
              continue;
            }
            result += ',';
          }
        }

        result += base64VLQ.encode(mapping.generatedColumn
                                   - previousGeneratedColumn);
        previousGeneratedColumn = mapping.generatedColumn;

        if (mapping.source != null) {
          result += base64VLQ.encode(this._sources.indexOf(mapping.source)
                                     - previousSource);
          previousSource = this._sources.indexOf(mapping.source);

          // lines are stored 0-based in SourceMap spec version 3
          result += base64VLQ.encode(mapping.originalLine - 1
                                     - previousOriginalLine);
          previousOriginalLine = mapping.originalLine - 1;

          result += base64VLQ.encode(mapping.originalColumn
                                     - previousOriginalColumn);
          previousOriginalColumn = mapping.originalColumn;

          if (mapping.name != null) {
            result += base64VLQ.encode(this._names.indexOf(mapping.name)
                                       - previousName);
            previousName = this._names.indexOf(mapping.name);
          }
        }
      }

      return result;
    };

  SourceMapGenerator.prototype._generateSourcesContent =
    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
      return aSources.map(function (source) {
        if (!this._sourcesContents) {
          return null;
        }
        if (aSourceRoot != null) {
          source = util.relative(aSourceRoot, source);
        }
        var key = util.toSetString(source);
        return Object.prototype.hasOwnProperty.call(this._sourcesContents,
                                                    key)
          ? this._sourcesContents[key]
          : null;
      }, this);
    };

  /**
   * Externalize the source map.
   */
  SourceMapGenerator.prototype.toJSON =
    function SourceMapGenerator_toJSON() {
      var map = {
        version: this._version,
        sources: this._sources.toArray(),
        names: this._names.toArray(),
        mappings: this._serializeMappings()
      };
      if (this._file != null) {
        map.file = this._file;
      }
      if (this._sourceRoot != null) {
        map.sourceRoot = this._sourceRoot;
      }
      if (this._sourcesContents) {
        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
      }

      return map;
    };

  /**
   * Render the source map being generated to a string.
   */
  SourceMapGenerator.prototype.toString =
    function SourceMapGenerator_toString() {
      return JSON.stringify(this);
    };

  exports.SourceMapGenerator = SourceMapGenerator;

});

},{"./array-set":47,"./base64-vlq":48,"./util":54,"amdefine":55}],53:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

  var SourceMapGenerator = _dereq_('./source-map-generator').SourceMapGenerator;
  var util = _dereq_('./util');

  // Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
  // operating systems these days (capturing the result).
  var REGEX_NEWLINE = /(\r?\n)/;

  // Matches a Windows-style newline, or any character.
  var REGEX_CHARACTER = /\r\n|[\s\S]/g;

  /**
   * SourceNodes provide a way to abstract over interpolating/concatenating
   * snippets of generated JavaScript source code while maintaining the line and
   * column information associated with the original source code.
   *
   * @param aLine The original line number.
   * @param aColumn The original column number.
   * @param aSource The original source's filename.
   * @param aChunks Optional. An array of strings which are snippets of
   *        generated JS, or other SourceNodes.
   * @param aName The original identifier.
   */
  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine == null ? null : aLine;
    this.column = aColumn == null ? null : aColumn;
    this.source = aSource == null ? null : aSource;
    this.name = aName == null ? null : aName;
    if (aChunks != null) this.add(aChunks);
  }

  /**
   * Creates a SourceNode from generated code and a SourceMapConsumer.
   *
   * @param aGeneratedCode The generated code
   * @param aSourceMapConsumer The SourceMap for the generated code
   * @param aRelativePath Optional. The path that relative sources in the
   *        SourceMapConsumer should be relative to.
   */
  SourceNode.fromStringWithSourceMap =
    function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
      // The SourceNode we want to fill with the generated code
      // and the SourceMap
      var node = new SourceNode();

      // All even indices of this array are one line of the generated code,
      // while all odd indices are the newlines between two adjacent lines
      // (since `REGEX_NEWLINE` captures its match).
      // Processed fragments are removed from this array, by calling `shiftNextLine`.
      var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
      var shiftNextLine = function() {
        var lineContents = remainingLines.shift();
        // The last line of a file might not have a newline.
        var newLine = remainingLines.shift() || "";
        return lineContents + newLine;
      };

      // We need to remember the position of "remainingLines"
      var lastGeneratedLine = 1, lastGeneratedColumn = 0;

      // The generate SourceNodes we need a code range.
      // To extract it current and last mapping is used.
      // Here we store the last mapping.
      var lastMapping = null;

      aSourceMapConsumer.eachMapping(function (mapping) {
        if (lastMapping !== null) {
          // We add the code from "lastMapping" to "mapping":
          // First check if there is a new line in between.
          if (lastGeneratedLine < mapping.generatedLine) {
            var code = "";
            // Associate first line with "lastMapping"
            addMappingWithCode(lastMapping, shiftNextLine());
            lastGeneratedLine++;
            lastGeneratedColumn = 0;
            // The remaining code is added without mapping
          } else {
            // There is no new line in between.
            // Associate the code between "lastGeneratedColumn" and
            // "mapping.generatedColumn" with "lastMapping"
            var nextLine = remainingLines[0];
            var code = nextLine.substr(0, mapping.generatedColumn -
                                          lastGeneratedColumn);
            remainingLines[0] = nextLine.substr(mapping.generatedColumn -
                                                lastGeneratedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
            addMappingWithCode(lastMapping, code);
            // No more remaining code, continue
            lastMapping = mapping;
            return;
          }
        }
        // We add the generated code until the first mapping
        // to the SourceNode without any mapping.
        // Each line is added as separate string.
        while (lastGeneratedLine < mapping.generatedLine) {
          node.add(shiftNextLine());
          lastGeneratedLine++;
        }
        if (lastGeneratedColumn < mapping.generatedColumn) {
          var nextLine = remainingLines[0];
          node.add(nextLine.substr(0, mapping.generatedColumn));
          remainingLines[0] = nextLine.substr(mapping.generatedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
        }
        lastMapping = mapping;
      }, this);
      // We have processed all mappings.
      if (remainingLines.length > 0) {
        if (lastMapping) {
          // Associate the remaining code in the current line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
        }
        // and add the remaining lines without any mapping
        node.add(remainingLines.join(""));
      }

      // Copy sourcesContent into SourceNode
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content != null) {
          if (aRelativePath != null) {
            sourceFile = util.join(aRelativePath, sourceFile);
          }
          node.setSourceContent(sourceFile, content);
        }
      });

      return node;

      function addMappingWithCode(mapping, code) {
        if (mapping === null || mapping.source === undefined) {
          node.add(code);
        } else {
          var source = aRelativePath
            ? util.join(aRelativePath, mapping.source)
            : mapping.source;
          node.add(new SourceNode(mapping.originalLine,
                                  mapping.originalColumn,
                                  source,
                                  code,
                                  mapping.name));
        }
      }
    };

  /**
   * Add a chunk of generated JS to this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function (chunk) {
        this.add(chunk);
      }, this);
    }
    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Add a chunk of generated JS to the beginning of this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i = aChunk.length-1; i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    }
    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Walk over the tree of JS snippets in this node and its children. The
   * walking function is called once for each snippet of JS and is passed that
   * snippet and the its original associated source's line/column location.
   *
   * @param aFn The traversal function.
   */
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    var chunk;
    for (var i = 0, len = this.children.length; i < len; i++) {
      chunk = this.children[i];
      if (chunk instanceof SourceNode) {
        chunk.walk(aFn);
      }
      else {
        if (chunk !== '') {
          aFn(chunk, { source: this.source,
                       line: this.line,
                       column: this.column,
                       name: this.name });
        }
      }
    }
  };

  /**
   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
   * each of `this.children`.
   *
   * @param aSep The separator.
   */
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len-1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  };

  /**
   * Call String.prototype.replace on the very right-most source snippet. Useful
   * for trimming whitespace from the end of a source node, etc.
   *
   * @param aPattern The pattern to replace.
   * @param aReplacement The thing to replace the pattern with.
   */
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild instanceof SourceNode) {
      lastChild.replaceRight(aPattern, aReplacement);
    }
    else if (typeof lastChild === 'string') {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    }
    else {
      this.children.push(''.replace(aPattern, aReplacement));
    }
    return this;
  };

  /**
   * Set the source content for a source file. This will be added to the SourceMapGenerator
   * in the sourcesContent field.
   *
   * @param aSourceFile The filename of the source file
   * @param aSourceContent The content of the source file
   */
  SourceNode.prototype.setSourceContent =
    function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
    };

  /**
   * Walk over the tree of SourceNodes. The walking function is called for each
   * source file content and is passed the filename and source content.
   *
   * @param aFn The traversal function.
   */
  SourceNode.prototype.walkSourceContents =
    function SourceNode_walkSourceContents(aFn) {
      for (var i = 0, len = this.children.length; i < len; i++) {
        if (this.children[i] instanceof SourceNode) {
          this.children[i].walkSourceContents(aFn);
        }
      }

      var sources = Object.keys(this.sourceContents);
      for (var i = 0, len = sources.length; i < len; i++) {
        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
      }
    };

  /**
   * Return the string representation of this source node. Walks over the tree
   * and concatenates all the various snippets together to one string.
   */
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function (chunk) {
      str += chunk;
    });
    return str;
  };

  /**
   * Returns the string representation of this source node along with a source
   * map.
   */
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map = new SourceMapGenerator(aArgs);
    var sourceMappingActive = false;
    var lastOriginalSource = null;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastOriginalName = null;
    this.walk(function (chunk, original) {
      generated.code += chunk;
      if (original.source !== null
          && original.line !== null
          && original.column !== null) {
        if(lastOriginalSource !== original.source
           || lastOriginalLine !== original.line
           || lastOriginalColumn !== original.column
           || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      chunk.match(REGEX_CHARACTER).forEach(function (ch, idx, array) {
        if (REGEX_NEWLINE.test(ch)) {
          generated.line++;
          generated.column = 0;
          // Mappings end at eol
          if (idx + 1 === array.length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column += ch.length;
        }
      });
    });
    this.walkSourceContents(function (sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });

    return { code: generated.code, map: map };
  };

  exports.SourceNode = SourceNode;

});

},{"./source-map-generator":52,"./util":54,"amdefine":55}],54:[function(_dereq_,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = _dereq_('amdefine')(module, _dereq_);
}
define(function (_dereq_, exports, module) {

  /**
   * This is a helper function for getting values from parameter/options
   * objects.
   *
   * @param args The object we are extracting values from
   * @param name The name of the property we are getting.
   * @param defaultValue An optional value to return if the property is missing
   * from the object. If this is not specified and the property is missing, an
   * error will be thrown.
   */
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
    } else if (arguments.length === 3) {
      return aDefaultValue;
    } else {
      throw new Error('"' + aName + '" is a required argument.');
    }
  }
  exports.getArg = getArg;

  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
  var dataUrlRegexp = /^data:.+\,.+$/;

  function urlParse(aUrl) {
    var match = aUrl.match(urlRegexp);
    if (!match) {
      return null;
    }
    return {
      scheme: match[1],
      auth: match[2],
      host: match[3],
      port: match[4],
      path: match[5]
    };
  }
  exports.urlParse = urlParse;

  function urlGenerate(aParsedUrl) {
    var url = '';
    if (aParsedUrl.scheme) {
      url += aParsedUrl.scheme + ':';
    }
    url += '//';
    if (aParsedUrl.auth) {
      url += aParsedUrl.auth + '@';
    }
    if (aParsedUrl.host) {
      url += aParsedUrl.host;
    }
    if (aParsedUrl.port) {
      url += ":" + aParsedUrl.port
    }
    if (aParsedUrl.path) {
      url += aParsedUrl.path;
    }
    return url;
  }
  exports.urlGenerate = urlGenerate;

  /**
   * Normalizes a path, or the path portion of a URL:
   *
   * - Replaces consequtive slashes with one slash.
   * - Removes unnecessary '.' parts.
   * - Removes unnecessary '<dir>/..' parts.
   *
   * Based on code in the Node.js 'path' core module.
   *
   * @param aPath The path or url to normalize.
   */
  function normalize(aPath) {
    var path = aPath;
    var url = urlParse(aPath);
    if (url) {
      if (!url.path) {
        return aPath;
      }
      path = url.path;
    }
    var isAbsolute = (path.charAt(0) === '/');

    var parts = path.split(/\/+/);
    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
      part = parts[i];
      if (part === '.') {
        parts.splice(i, 1);
      } else if (part === '..') {
        up++;
      } else if (up > 0) {
        if (part === '') {
          // The first part is blank if the path is absolute. Trying to go
          // above the root is a no-op. Therefore we can remove all '..' parts
          // directly after the root.
          parts.splice(i + 1, up);
          up = 0;
        } else {
          parts.splice(i, 2);
          up--;
        }
      }
    }
    path = parts.join('/');

    if (path === '') {
      path = isAbsolute ? '/' : '.';
    }

    if (url) {
      url.path = path;
      return urlGenerate(url);
    }
    return path;
  }
  exports.normalize = normalize;

  /**
   * Joins two paths/URLs.
   *
   * @param aRoot The root path or URL.
   * @param aPath The path or URL to be joined with the root.
   *
   * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
   *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
   *   first.
   * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
   *   is updated with the result and aRoot is returned. Otherwise the result
   *   is returned.
   *   - If aPath is absolute, the result is aPath.
   *   - Otherwise the two paths are joined with a slash.
   * - Joining for example 'http://' and 'www.example.com' is also supported.
   */
  function join(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    if (aPath === "") {
      aPath = ".";
    }
    var aPathUrl = urlParse(aPath);
    var aRootUrl = urlParse(aRoot);
    if (aRootUrl) {
      aRoot = aRootUrl.path || '/';
    }

    // `join(foo, '//www.example.org')`
    if (aPathUrl && !aPathUrl.scheme) {
      if (aRootUrl) {
        aPathUrl.scheme = aRootUrl.scheme;
      }
      return urlGenerate(aPathUrl);
    }

    if (aPathUrl || aPath.match(dataUrlRegexp)) {
      return aPath;
    }

    // `join('http://', 'www.example.com')`
    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
      aRootUrl.host = aPath;
      return urlGenerate(aRootUrl);
    }

    var joined = aPath.charAt(0) === '/'
      ? aPath
      : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

    if (aRootUrl) {
      aRootUrl.path = joined;
      return urlGenerate(aRootUrl);
    }
    return joined;
  }
  exports.join = join;

  /**
   * Make a path relative to a URL or another path.
   *
   * @param aRoot The root path or URL.
   * @param aPath The path or URL to be made relative to aRoot.
   */
  function relative(aRoot, aPath) {
    aRoot = aRoot.replace(/\/$/, '');

    // XXX: It is possible to remove this block, and the tests still pass!
    var url = urlParse(aRoot);
    if (aPath.charAt(0) == "/" && url && url.path == "/") {
      return aPath.slice(1);
    }

    return aPath.indexOf(aRoot + '/') === 0
      ? aPath.substr(aRoot.length + 1)
      : aPath;
  }
  exports.relative = relative;

  /**
   * Because behavior goes wacky when you set `__proto__` on objects, we
   * have to prefix all the strings in our set with an arbitrary character.
   *
   * See https://github.com/mozilla/source-map/pull/31 and
   * https://github.com/mozilla/source-map/issues/30
   *
   * @param String aStr
   */
  function toSetString(aStr) {
    return '$' + aStr;
  }
  exports.toSetString = toSetString;

  function fromSetString(aStr) {
    return aStr.substr(1);
  }
  exports.fromSetString = fromSetString;

  function strcmp(aStr1, aStr2) {
    var s1 = aStr1 || "";
    var s2 = aStr2 || "";
    return (s1 > s2) - (s1 < s2);
  }

  /**
   * Comparator between two mappings where the original positions are compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same original source/line/column, but different generated
   * line and column the same. Useful when searching for a mapping with a
   * stubbed out mapping.
   */
  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
    var cmp;

    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp || onlyCompareOriginal) {
      return cmp;
    }

    cmp = strcmp(mappingA.name, mappingB.name);
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp) {
      return cmp;
    }

    return mappingA.generatedColumn - mappingB.generatedColumn;
  };
  exports.compareByOriginalPositions = compareByOriginalPositions;

  /**
   * Comparator between two mappings where the generated positions are
   * compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same generated line and column, but different
   * source/name/original line and column the same. Useful when searching for a
   * mapping with a stubbed out mapping.
   */
  function compareByGeneratedPositions(mappingA, mappingB, onlyCompareGenerated) {
    var cmp;

    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp || onlyCompareGenerated) {
      return cmp;
    }

    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp) {
      return cmp;
    }

    return strcmp(mappingA.name, mappingB.name);
  };
  exports.compareByGeneratedPositions = compareByGeneratedPositions;

});

},{"amdefine":55}],55:[function(_dereq_,module,exports){
(function (process,__filename){
/** vim: et:ts=4:sw=4:sts=4
 * @license amdefine 0.1.0 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/amdefine for details
 */

/*jslint node: true */
/*global module, process */
'use strict';

/**
 * Creates a define for node.
 * @param {Object} module the "module" object that is defined by Node for the
 * current module.
 * @param {Function} [requireFn]. Node's require function for the current module.
 * It only needs to be passed in Node versions before 0.5, when module.require
 * did not exist.
 * @returns {Function} a define function that is usable for the current node
 * module.
 */
function amdefine(module, requireFn) {
    'use strict';
    var defineCache = {},
        loaderCache = {},
        alreadyCalled = false,
        path = _dereq_('path'),
        makeRequire, stringRequire;

    /**
     * Trims the . and .. from an array of path segments.
     * It will keep a leading path segment if a .. will become
     * the first path segment, to help with module name lookups,
     * which act like paths, but can be remapped. But the end result,
     * all paths that use this function should look normalized.
     * NOTE: this method MODIFIES the input array.
     * @param {Array} ary the array of path segments.
     */
    function trimDots(ary) {
        var i, part;
        for (i = 0; ary[i]; i+= 1) {
            part = ary[i];
            if (part === '.') {
                ary.splice(i, 1);
                i -= 1;
            } else if (part === '..') {
                if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                    //End of the line. Keep at least one non-dot
                    //path segment at the front so it can be mapped
                    //correctly to disk. Otherwise, there is likely
                    //no path mapping for a path starting with '..'.
                    //This can still fail, but catches the most reasonable
                    //uses of ..
                    break;
                } else if (i > 0) {
                    ary.splice(i - 1, 2);
                    i -= 2;
                }
            }
        }
    }

    function normalize(name, baseName) {
        var baseParts;

        //Adjust any relative paths.
        if (name && name.charAt(0) === '.') {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                baseParts = baseName.split('/');
                baseParts = baseParts.slice(0, baseParts.length - 1);
                baseParts = baseParts.concat(name.split('/'));
                trimDots(baseParts);
                name = baseParts.join('/');
            }
        }

        return name;
    }

    /**
     * Create the normalize() function passed to a loader plugin's
     * normalize method.
     */
    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(id) {
        function load(value) {
            loaderCache[id] = value;
        }

        load.fromText = function (id, text) {
            //This one is difficult because the text can/probably uses
            //define, and any relative paths and requires should be relative
            //to that id was it would be found on disk. But this would require
            //bootstrapping a module/require fairly deeply from node core.
            //Not sure how best to go about that yet.
            throw new Error('amdefine does not implement load.fromText');
        };

        return load;
    }

    makeRequire = function (systemRequire, exports, module, relId) {
        function amdRequire(deps, callback) {
            if (typeof deps === 'string') {
                //Synchronous, single module require('')
                return stringRequire(systemRequire, exports, module, deps, relId);
            } else {
                //Array of dependencies with a callback.

                //Convert the dependencies to modules.
                deps = deps.map(function (depName) {
                    return stringRequire(systemRequire, exports, module, depName, relId);
                });

                //Wait for next tick to call back the require call.
                process.nextTick(function () {
                    callback.apply(null, deps);
                });
            }
        }

        amdRequire.toUrl = function (filePath) {
            if (filePath.indexOf('.') === 0) {
                return normalize(filePath, path.dirname(module.filename));
            } else {
                return filePath;
            }
        };

        return amdRequire;
    };

    //Favor explicit value, passed in if the module wants to support Node 0.4.
    requireFn = requireFn || function req() {
        return module.require.apply(module, arguments);
    };

    function runFactory(id, deps, factory) {
        var r, e, m, result;

        if (id) {
            e = loaderCache[id] = {};
            m = {
                id: id,
                uri: __filename,
                exports: e
            };
            r = makeRequire(requireFn, e, m, id);
        } else {
            //Only support one define call per file
            if (alreadyCalled) {
                throw new Error('amdefine with no module ID cannot be called more than once per file.');
            }
            alreadyCalled = true;

            //Use the real variables from node
            //Use module.exports for exports, since
            //the exports in here is amdefine exports.
            e = module.exports;
            m = module;
            r = makeRequire(requireFn, e, m, module.id);
        }

        //If there are dependencies, they are strings, so need
        //to convert them to dependency values.
        if (deps) {
            deps = deps.map(function (depName) {
                return r(depName);
            });
        }

        //Call the factory with the right dependencies.
        if (typeof factory === 'function') {
            result = factory.apply(m.exports, deps);
        } else {
            result = factory;
        }

        if (result !== undefined) {
            m.exports = result;
            if (id) {
                loaderCache[id] = m.exports;
            }
        }
    }

    stringRequire = function (systemRequire, exports, module, id, relId) {
        //Split the ID by a ! so that
        var index = id.indexOf('!'),
            originalId = id,
            prefix, plugin;

        if (index === -1) {
            id = normalize(id, relId);

            //Straight module lookup. If it is one of the special dependencies,
            //deal with it, otherwise, delegate to node.
            if (id === 'require') {
                return makeRequire(systemRequire, exports, module, relId);
            } else if (id === 'exports') {
                return exports;
            } else if (id === 'module') {
                return module;
            } else if (loaderCache.hasOwnProperty(id)) {
                return loaderCache[id];
            } else if (defineCache[id]) {
                runFactory.apply(null, defineCache[id]);
                return loaderCache[id];
            } else {
                if(systemRequire) {
                    return systemRequire(originalId);
                } else {
                    throw new Error('No module with ID: ' + id);
                }
            }
        } else {
            //There is a plugin in play.
            prefix = id.substring(0, index);
            id = id.substring(index + 1, id.length);

            plugin = stringRequire(systemRequire, exports, module, prefix, relId);

            if (plugin.normalize) {
                id = plugin.normalize(id, makeNormalize(relId));
            } else {
                //Normalize the ID normally.
                id = normalize(id, relId);
            }

            if (loaderCache[id]) {
                return loaderCache[id];
            } else {
                plugin.load(id, makeRequire(systemRequire, exports, module, relId), makeLoad(id), {});

                return loaderCache[id];
            }
        }
    };

    //Create a define function specific to the module asking for amdefine.
    function define(id, deps, factory) {
        if (Array.isArray(id)) {
            factory = deps;
            deps = id;
            id = undefined;
        } else if (typeof id !== 'string') {
            factory = id;
            id = deps = undefined;
        }

        if (deps && !Array.isArray(deps)) {
            factory = deps;
            deps = undefined;
        }

        if (!deps) {
            deps = ['require', 'exports', 'module'];
        }

        //Set up properties for this module. If an ID, then use
        //internal cache. If no ID, then use the external variables
        //for this node module.
        if (id) {
            //Put the module in deep freeze until there is a
            //require call for it.
            defineCache[id] = [id, deps, factory];
        } else {
            runFactory(id, deps, factory);
        }
    }

    //define.require, which has access to all the values in the
    //cache. Useful for AMD modules that all have IDs in the file,
    //but need to finally export a value to node based on one of those
    //IDs.
    define.require = function (id) {
        if (loaderCache[id]) {
            return loaderCache[id];
        }

        if (defineCache[id]) {
            runFactory.apply(null, defineCache[id]);
            return loaderCache[id];
        }
    };

    define.amd = {};

    return define;
}

module.exports = amdefine;

}).call(this,_dereq_("FWaASH"),"/../node_modules/autoprefixer/node_modules/css-stringify/node_modules/source-map/node_modules/amdefine/amdefine.js")
},{"FWaASH":61,"path":60}],56:[function(_dereq_,module,exports){

},{}],57:[function(_dereq_,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = _dereq_('base64-js')
var ieee754 = _dereq_('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":58,"ieee754":59}],58:[function(_dereq_,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],59:[function(_dereq_,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],60:[function(_dereq_,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,_dereq_("FWaASH"))
},{"FWaASH":61}],61:[function(_dereq_,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],62:[function(_dereq_,module,exports){

module.exports = _dereq_('./lib/calc');

},{"./lib/calc":63}],63:[function(_dereq_,module,exports){

/**
 * Calculation Plugin
 *
 * Useful in combination with the [rework-vars](https://npmjs.org/package/rework-vars) plugin, e.g:
 *
 *   :root {
 *     var-base-font-size: 16px;
 *   }
 *   body {
 *     font-size: var(base-font-size);
 *   }
 *   h1 {
 *     font-size: calc(var(base-font-size) * 2);
 *   }
 *
 * Yields:
 *
 *   :root {
 *     var-base-font-size: 16px;
 *   }
 *   body {
 *     font-size: 16px;
 *   }
 *   h1 {
 *     font-size: 32px;
 *   }
 *
 */

module.exports = function (style) {
    rules(style.rules);
};

/**
 * Constants
 */
var DEFAULT_UNIT = 'px',
    EXPRESSION_METHOD_NAME =  'calc',
    EXPRESSION_OPT_VENDOR_PREFIX = '(\\-[a-z]+\\-)?',
    EXPRESSION_METHOD_REGEXP = EXPRESSION_OPT_VENDOR_PREFIX + EXPRESSION_METHOD_NAME,
    EXPRESSION_REGEXP = '\\b' + EXPRESSION_METHOD_REGEXP + '\\(';

/**
 * Visit all rules
 *
 * @param {Array} arr Array with css rules
 * @api private
 */
function rules(arr) {
    arr.forEach(function (rule) {
        if (rule.rules) rules(rule.rules);
        if (rule.declarations) visit(rule.declarations);
    });
}

/**
 * Visit all declarations (in a rule)
 *
 * @param {Array} declarations
 * @api private
 */
function visit(declarations) {
    declarations.forEach(function (decl) {
        if (!hasExpressions(decl.value)) return;

        var expressions = getExpressionsFromValue(decl.value);

        evaluateAndApplyExpressions(expressions, decl);
    });
}

/**
 * Checks if a value contains an expression
 *
 * @param {String} value
 * @returns {Boolean}
 * @api private
 */
function hasExpressions(value) {
    return (new RegExp(EXPRESSION_REGEXP)).exec(value);
}

/**
 * Parses expressions in a value
 *
 * @param {String} value
 * @returns {Array}
 * @api private
 */
function getExpressionsFromValue(value) {
    var parentheses = 0,
        expressions = [],
        start = null;

    // Parse value and extract expressions:
    for (var i = 0; i < value.length; i++) {
        if (value[i] == '(' && value.slice(i - 4, i) == EXPRESSION_METHOD_NAME && !start) {
            start = i;
            parentheses++;
        } else if (value[i] == '(' && start !== null) {
            parentheses++;
        } else if (value[i] == ')' && start !== null) {
            if (!--parentheses) {
                expressions.push(value.slice(start + 1, i));
                start = null;
            }
        }
    }

    return expressions;
}

/**
 * Walkthrough all expressions, evaluate them and insert them into the declaration
 *
 * @param {Array} expressions
 * @param {Object} declaration
 * @api private
 */
function evaluateAndApplyExpressions(expressions, declaration) {
    expressions.forEach(function (expression) {
        var result = evaluateExpression(expression);

        if (!result) return;

        // Insert the evaluated value:
        var expRegexp = new RegExp(
                                EXPRESSION_METHOD_REGEXP + '\\(' +
                                escapeExp(expression) + '\\)'
                            );
        declaration.value = declaration.value.replace(expRegexp, result);
    });
}

/**
 * Evaluates an expression
 *
 * @param {String} expression
 * @returns {String}
 * @api private
 */
function evaluateExpression (expression) {
    var originalExpression = EXPRESSION_METHOD_NAME + '(' + expression + ')';

    // Remove method names for possible nested expressions:
    expression = expression.replace(new RegExp(EXPRESSION_REGEXP, 'g'), '(');

    var uniqueUnits = getUnitsInExpression(expression);

    // If multiple units let the expression be (i.e. fallback to CSS3 calc())
    if (uniqueUnits.length > 1)
        return false;

    if (!uniqueUnits.length)
        console.warn('No unit found in expression: "' + originalExpression + '", defaults to: "' + DEFAULT_UNIT + '"');

    // Use default unit if needed:
    var unit = uniqueUnits[0] || DEFAULT_UNIT;

    if (unit === '%') {
        // Convert percentages to numbers, to handle expressions like: 50% * 50% (will become: 25%):
        expression = expression.replace(/\b[0-9\.]+%/g, function (percent) {
            return parseFloat(percent.slice(0, -1)) * 0.01;
        });
    }

    // Remove units in expression:
    var toEvaluate = expression.replace(new RegExp(unit, 'g'), '');

    var result;

    try {
        result = eval(toEvaluate);
    } catch (e) {
        return false;
    }

    // Transform back to a percentage result:
    if (unit === '%')
        result *= 100;

    // We don't need units for zero values...
    if (result !== 0)
        result += unit;

    return result;
}

/**
 * Checks what units are used in an expression
 *
 * @param {String} expression
 * @returns {Array}
 * @api private
 */
function getUnitsInExpression(expression) {
    var uniqueUnits = [],
        unitRegEx = /[\.0-9]([%a-z]+)/g,
        matches;

    while (matches = unitRegEx.exec(expression)) {
        if (!matches || !matches[1]) continue;
        if (!~uniqueUnits.indexOf(matches[1]))
            uniqueUnits.push(matches[1]);
    }

    return uniqueUnits;
}

/**
 * Escape string for inclusion in a regex pattern without conflicts
 *
 * @param  {String} str String to escape
 * @return {String} Escaped string
 * @api private
 */
function escapeExp(str) {
    return String(str).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

},{}],64:[function(_dereq_,module,exports){

var balanced = _dereq_('balanced-match');
var color = _dereq_('css-color-function');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Plugin to convert CSS color functions.
 *
 * @param {Object} stylesheet
 */

function plugin(stylesheet){
  stylesheet.rules.forEach(rule);
}

/**
 * Convert a `rule`.
 *
 * @param {Object} rule
 */

function rule(obj){
  if (obj.declarations) obj.declarations.forEach(declaration);
  if (obj.rules) obj.rules.forEach(rule);
}

/**
 * Convert a `dec`.
 *
 * @param {Object} dec
 */

function declaration(dec){
  if (!dec.value) return;
  try {
    dec.value = convert(dec.value);
  } catch (err) {
    err.position = dec.position;
    throw err;
  }
}

/**
 * Convert any color functions in a CSS property value `string` into their RGBA
 * equivalent.
 *
 * @param {String} string
 * @return {String}
 */

function convert(string){
  var index = string.indexOf('color(');
  if (index == -1) return string;

  var fn = string.slice(index);
  var ret = balanced('(', ')', fn);
  if (!ret) throw new SyntaxError('Missing closing parentheses');
  fn = 'color(' + ret.body + ')';

  return string.slice(0, index) + color.convert(fn) + convert(ret.post);
}
},{"balanced-match":65,"css-color-function":68}],65:[function(_dereq_,module,exports){
module.exports = function(a, b, str) {
  var bal = 0;
  var m = {};

  for (var i = 0; i < str.length; i++) {
    if (str[i] == a) {
      if (!('start' in m)) m.start = i;
      bal++;
    }
    else if (str[i] == b) {
      bal--;
      if (!bal) {
        m.end = i;
        m.pre = str.substr(0, m.start);
        m.body = (m.end - m.start > 1)
          ? str.substring(m.start + 1, m.end)
          : '';
        m.post = str.slice(m.end + 1);
        return m;
      }
    }
  }
};


},{}],66:[function(_dereq_,module,exports){

var Color = _dereq_('color');

/**
 * Basic RGBA adjusters.
 */

exports.red = rgbaAdjuster('red');
exports.blue = rgbaAdjuster('blue');
exports.green = rgbaAdjuster('green');
exports.alpha = exports.a = rgbaAdjuster('alpha');

/**
 * RGB adjuster.
 */

exports.rgb = function () {
  // TODO
};

/**
 * Basic HSLWB adjusters.
 */

exports.hue = exports.h = hslwbAdjuster('hue');
exports.saturation = exports.s = hslwbAdjuster('saturation');
exports.lightness = exports.l = hslwbAdjuster('lightness');
exports.whiteness = exports.w = hslwbAdjuster('whiteness');
exports.blackness = exports.b = hslwbAdjuster('blackness');

/**
 * Blend adjuster.
 *
 * @param {Color} color
 * @param {Object} args
 */

exports.blend = function (color, args) {
  var other = new Color(args[0].value);
  var percentage = parseInt(args[1].value, 10) / 100;
  color.mix(other, percentage);
};

/**
 * Tint adjuster.
 *
 * @param {Color} color
 * @param {Object} args
 */

exports.tint = function (color, args) {
  args.unshift({ type: 'argument', value: 'white' });
  exports.blend(color, args);
};

/**
 * Share adjuster.
 *
 * @param {Color} color
 * @param {Object} args
 */

exports.shade = function (color, args) {
  args.unshift({ type: 'argument', value: 'black' });
  exports.blend(color, args);
};

/**
 * Generate a value or percentage of modifier.
 *
 * @param {String} prop
 * @return {Function}
 */

function rgbaAdjuster (prop) {
  return function (color, args) {
    var mod;
    if (args[0].type == 'modifier') mod = args.shift().value;

    var val = args[0].value;
    if (val.indexOf('%') != -1) {
      val = parseInt(val, 10) / 100;
      if (!mod) {
        val = val * (prop == 'alpha' ? 1 : 255);
      } else if (mod != '*') {
        val = color[prop]() * val;
      }
    }

    color[prop](modify(color[prop](), val, mod));
  };
}

/**
 * Generate a basic HSLWB adjuster.
 *
 * @param {String} prop
 * @return {Function}
 */

function hslwbAdjuster (prop) {
  return function (color, args) {
    var mod;
    if (args[0].type == 'modifier') mod = args.shift().value;
    var val = parseFloat(args[0].value, 10);
    color[prop](modify(color[prop](), val, mod));
  };
}

/**
 * Return the percentage of a `number` for a given percentage `string`.
 *
 * @param {Number} number
 * @param {String} string
 * @return {Number}
 */

function percentageOf (number, string) {
  var percent = parseInt(string, 10) / 100;
  return number * percent;
}

/**
 * Modify a `val` by an `amount` with an optional `modifier`.
 *
 * @param {Number} val
 * @param {Number} amount
 * @param {String} modifier (optional)
 */

function modify (val, amount, modifier) {
  switch (modifier) {
    case '+': return val + amount;
    case '-': return val - amount;
    case '*': return val * amount;
    default: return amount;
  }
}
},{"color":70}],67:[function(_dereq_,module,exports){

var balanced = _dereq_('balanced-match');
var Color = _dereq_('color');
var parse = _dereq_('./parse');
var adjusters = _dereq_('./adjusters');

/**
 * Expose `convert`.
 */

module.exports = convert;

/**
 * Convert a color function CSS `string` into an RGB color string.
 *
 * @param {String} string
 * @return {String}
 */

function convert (string) {
  var index = string.indexOf('color(');
  if (index == -1) return string;

  string = string.slice(index);
  string = balanced('(', ')', string);
  if (!string) throw new SyntaxError('Missing closing parentheses');
  var ast = parse('color(' + string.body + ')');
  return toRGB(ast) + convert(string.post);
}

/**
 * Given a color `ast` return an RGB color string.
 *
 * @param {Object} ast
 * @return {String}
 */

function toRGB (ast) {
  var color = new Color(ast.arguments[0].value);
  var fns = ast.arguments.slice(1);

  fns.forEach(function (adjuster) {
    var name = adjuster.name;
    if (!adjusters[name]) return;

    // convert nested color functions
    adjuster.arguments.forEach(function (arg) {
      if (arg.type == 'function' && arg.name == 'color') {
        arg.value = toRGB(arg.value);
        arg.type = 'color';
        delete arg.name;
      }
    });

    // apply adjuster transformations
    adjusters[name](color, adjuster.arguments);
  });

  return color.rgbString();
}
},{"./adjusters":66,"./parse":69,"balanced-match":65,"color":70}],68:[function(_dereq_,module,exports){

var convert = _dereq_('./convert');
var parse = _dereq_('./parse');

/**
 * Expose `convert`.
 */

exports.convert = convert;

/**
 * Expose `parse`.
 */

exports.parse = parse;
},{"./convert":67,"./parse":69}],69:[function(_dereq_,module,exports){

var debug = _dereq_('debug')('css-color-function:parse');

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Parse a CSS color function string.
 *
 * @param {String} string
 * @return {Array}
 */

function parse (string) {
  if ('string' != typeof string) string = string.toString();

  /**
   * Match the current position in the string against a `regexp`, returning the
   * match if one exists.
   *
   * @param {RegExp} regexp
   * @return {Undefined or Array}
   */

  function match (regexp) {
    var m = regexp.exec(string);
    if (!m) return;
    string = string.slice(m[0].length);
    return m.slice(1);
  }

  /**
   * Match whitespace.
   */

  function whitespace () {
    match(/^\s+/);
  }

  /**
   * Match a right parentheses.
   *
   * @return {Array or Undefined}
   */

  function rparen () {
    var m = match(/^\)/);
    if (!m) return;
    debug('rparen');
    return m;
  }

  /**
   * Match a modifier: '+' '-' '*'.
   *
   * @return {Object or Undefined}
   */

  function modifier () {
    var m = match(/^([\+\-\*])/);
    if (!m) return;
    var ret = {};
    ret.type = 'modifier';
    ret.value = m[0];
    debug('modifier %o', ret);
    return ret;
  }

  /**
   * Match a generic number function argument.
   *
   * @return {Object or Undefined}
   */

  function number () {
    var m = match(/^([^\)\s]+)/);
    if (!m) return;
    var ret = {};
    ret.type = 'number';
    ret.value = m[0];
    debug('number %o', ret);
    return ret;
  }

  /**
   * Match a function's arguments.
   *
   * @return {Array}
   */

  function args () {
    var ret = [];
    var el;
    while (el = modifier() || fn() || number()) {
      ret.push(el);
      whitespace();
    }
    debug('args %o', ret);
    return ret;
  }

  /**
   * Match an adjuster function.
   *
   * @return {Object or Undefined}
   */

  function adjuster () {
    var m = match(/^(\w+)\(/);
    if (!m) return;
    whitespace();
    var el;
    var ret = {};
    ret.type = 'function';
    ret.name = m[0];
    ret.arguments = args();
    if (!rparen()) throw new SyntaxError('Missing closing parentheses');
    debug('adjuster %o', ret);
    return ret;
  }

  /**
   * Match a color.
   *
   * @return {Object}
   */

  function color () {
    var ret = {};
    ret.type = 'color';

    var col = match(/([^\)\s]+)/)[0];
    if (col.indexOf('(') != -1) {
      var piece = match(/([^\)]*?\))/)[0];
      col = col + piece;
    }

    ret.value = col;
    whitespace();
    return ret;
  }

  /**
   * Match a color function, capturing the first color argument and any adjuster
   * functions after it.
   *
   * @return {Object or Undefined}
   */

  function fn () {
    if (!match(/^color\(/)) return;
    whitespace();

    var ret = {};
    ret.type = 'function';
    ret.name = 'color';
    ret.arguments = [fn() || color()];

    var el;
    while (el = adjuster()) {
      ret.arguments.push(el);
      whitespace();
    }

    if (!rparen()) throw new SyntaxError('Missing closing parentheses');
    debug('function %o', ret);
    return ret;
  }

  /**
   * Return the parsed color function.
   */

  return fn();
}
},{"debug":74}],70:[function(_dereq_,module,exports){
/* MIT license */
var convert = _dereq_("color-convert"),
    string = _dereq_("color-string");

module.exports = function(cssString) {
   return new Color(cssString);
};

var Color = function(cssString) {
   this.values = {
      rgb: [0, 0, 0],
      hsl: [0, 0, 0],
      hsv: [0, 0, 0],
      cmyk: [0, 0, 0, 0],
      alpha: 1
   }

   // parse Color() argument
   if (typeof cssString == "string") {
      var vals = string.getRgba(cssString);
      if (vals) {
         this.setValues("rgb", vals);
      }
      else if(vals = string.getHsla(cssString)) {
         this.setValues("hsl", vals);
      }
   }
   else if (typeof cssString == "object") {
      var vals = cssString;
      if(vals["r"] !== undefined || vals["red"] !== undefined) {
         this.setValues("rgb", vals)
      }
      else if(vals["l"] !== undefined || vals["lightness"] !== undefined) {
         this.setValues("hsl", vals)
      }
      else if(vals["v"] !== undefined || vals["value"] !== undefined) {
         this.setValues("hsv", vals)
      }
      else if(vals["c"] !== undefined || vals["cyan"] !== undefined) {
         this.setValues("cmyk", vals)
      }
   }
}

Color.prototype = {
   rgb: function (vals) {
      return this.setSpace("rgb", arguments);
   },
   hsl: function(vals) {
      return this.setSpace("hsl", arguments);
   },
   hsv: function(vals) {
      return this.setSpace("hsv", arguments);
   },
   cmyk: function(vals) {
      return this.setSpace("cmyk", arguments);
   },

   rgbArray: function() {
      return this.values.rgb;
   },
   hslArray: function() {
      return this.values.hsl;
   },
   hsvArray: function() {
      return this.values.hsv;
   },
   cmykArray: function() {
      return this.values.cmyk;
   },
   rgbaArray: function() {
      var rgb = this.values.rgb;
      return rgb.concat([this.values.alpha]);
   },
   hslaArray: function() {
      var hsl = this.values.hsl;
      return hsl.concat([this.values.alpha]);
   },

   alpha: function(val) {
      if (val === undefined) {
         return this.values.alpha;
      }
      this.setValues("alpha", val);
      return this;
   },

   red: function(val) {
      return this.setChannel("rgb", 0, val);
   },
   green: function(val) {
      return this.setChannel("rgb", 1, val);
   },
   blue: function(val) {
      return this.setChannel("rgb", 2, val);
   },
   hue: function(val) {
      return this.setChannel("hsl", 0, val);
   },
   saturation: function(val) {
      return this.setChannel("hsl", 1, val);
   },
   lightness: function(val) {
      return this.setChannel("hsl", 2, val);
   },
   saturationv: function(val) {
      return this.setChannel("hsv", 1, val);
   },
   value: function(val) {
      return this.setChannel("hsv", 2, val);
   },
   cyan: function(val) {
      return this.setChannel("cmyk", 0, val);
   },
   magenta: function(val) {
      return this.setChannel("cmyk", 1, val);
   },
   yellow: function(val) {
      return this.setChannel("cmyk", 2, val);
   },
   black: function(val) {
      return this.setChannel("cmyk", 3, val);
   },

   hexString: function() {
      return string.hexString(this.values.rgb);
   },
   rgbString: function() {
      return string.rgbString(this.values.rgb, this.values.alpha);
   },
   rgbaString: function() {
      return string.rgbaString(this.values.rgb, this.values.alpha);
   },
   percentString: function() {
      return string.percentString(this.values.rgb, this.values.alpha);
   },
   hslString: function() {
      return string.hslString(this.values.hsl, this.values.alpha);
   },
   hslaString: function() {
      return string.hslaString(this.values.hsl, this.values.alpha);
   },
   keyword: function() {
      return string.keyword(this.values.rgb, this.values.alpha);
   },

   luminosity: function() {
      // http://www.w3.org/TR/WCAG20/#relativeluminancedef
      var rgb = this.values.rgb;
      var lum = [];
      for (var i = 0; i < rgb.length; i++) {
         var chan = rgb[i] / 255;
         lum[i] = (chan <= 0.03928) ? chan / 12.92
                  : Math.pow(((chan + 0.055) / 1.055), 2.4)
      }
      return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
   },

   contrast: function(color2) {
      // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
      var lum1 = this.luminosity();
      var lum2 = color2.luminosity();
      if (lum1 > lum2) {
         return (lum1 + 0.05) / (lum2 + 0.05)
      };
      return (lum2 + 0.05) / (lum1 + 0.05);
   },

   dark: function() {
      // YIQ equation from http://24ways.org/2010/calculating-color-contrast
      var rgb = this.values.rgb,
          yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
   	return yiq < 128;
   },

   light: function() {
      return !this.dark();
   },

   negate: function() {
      var rgb = []
      for (var i = 0; i < 3; i++) {
         rgb[i] = 255 - this.values.rgb[i];
      }
      this.setValues("rgb", rgb);
      return this;
   },

   lighten: function(ratio) {
      this.values.hsl[2] += this.values.hsl[2] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   darken: function(ratio) {
      this.values.hsl[2] -= this.values.hsl[2] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   saturate: function(ratio) {
      this.values.hsl[1] += this.values.hsl[1] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   desaturate: function(ratio) {
      this.values.hsl[1] -= this.values.hsl[1] * ratio;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   greyscale: function() {
      var rgb = this.values.rgb;
      // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
      var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
      this.setValues("rgb", [val, val, val]);
      return this;
   },

   clearer: function(ratio) {
      this.setValues("alpha", this.values.alpha - (this.values.alpha * ratio));
      return this;
   },

   opaquer: function(ratio) {
      this.setValues("alpha", this.values.alpha + (this.values.alpha * ratio));
      return this;
   },

   rotate: function(degrees) {
      var hue = this.values.hsl[0];
      hue = (hue + degrees) % 360;
      hue = hue < 0 ? 360 + hue : hue;
      this.values.hsl[0] = hue;
      this.setValues("hsl", this.values.hsl);
      return this;
   },

   mix: function(color2, weight) {
      weight = 1 - (weight == null ? 0.5 : weight);

      // algorithm from Sass's mix(). Ratio of first color in mix is
      // determined by the alphas of both colors and the weight
      var t1 = weight * 2 - 1,
          d = this.alpha() - color2.alpha();

      var weight1 = (((t1 * d == -1) ? t1 : (t1 + d) / (1 + t1 * d)) + 1) / 2;
      var weight2 = 1 - weight1;

      var rgb = this.rgbArray();
      var rgb2 = color2.rgbArray();

      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = rgb[i] * weight1 + rgb2[i] * weight2;
      }
      this.setValues("rgb", rgb);

      var alpha = this.alpha() * weight + color2.alpha() * (1 - weight);
      this.setValues("alpha", alpha);

      return this;
   },

   toJSON: function() {
     return this.rgb();
   },

   clone: function() {
     return new Color(this.rgb());
   },
}


Color.prototype.getValues = function(space) {
   var vals = {};
   for (var i = 0; i < space.length; i++) {
      vals[space[i]] = this.values[space][i];
   }
   if (this.values.alpha != 1) {
      vals["a"] = this.values.alpha;
   }
   // {r: 255, g: 255, b: 255, a: 0.4}
   return vals;
}

Color.prototype.setValues = function(space, vals) {
   var spaces = {
      "rgb": ["red", "green", "blue"],
      "hsl": ["hue", "saturation", "lightness"],
      "hsv": ["hue", "saturation", "value"],
      "cmyk": ["cyan", "magenta", "yellow", "black"]
   };

   var maxes = {
      "rgb": [255, 255, 255],
      "hsl": [360, 100, 100],
      "hsv": [360, 100, 100],
      "cmyk": [100, 100, 100, 100],
   };

   var alpha = 1;
   if (space == "alpha") {
      alpha = vals;
   }
   else if (vals.length) {
      // [10, 10, 10]
      this.values[space] = vals.slice(0, space.length);
      alpha = vals[space.length];
   }
   else if (vals[space[0]] !== undefined) {
      // {r: 10, g: 10, b: 10}
      for (var i = 0; i < space.length; i++) {
        this.values[space][i] = vals[space[i]];
      }
      alpha = vals.a;
   }
   else if (vals[spaces[space][0]] !== undefined) {
      // {red: 10, green: 10, blue: 10}
      var chans = spaces[space];
      for (var i = 0; i < space.length; i++) {
        this.values[space][i] = vals[chans[i]];
      }
      alpha = vals.alpha;
   }
   this.values.alpha = Math.max(0, Math.min(1, (alpha !== undefined ? alpha : this.values.alpha) ));
   if (space == "alpha") {
      return;
   }

   // convert to all the other color spaces
   for (var sname in spaces) {
      if (sname != space) {
         this.values[sname] = convert[space][sname](this.values[space])
      }

      // cap values
      for (var i = 0; i < sname.length; i++) {
         var capped = Math.max(0, Math.min(maxes[sname][i], this.values[sname][i]));
         this.values[sname][i] = Math.round(capped);
      }
   }
   return true;
}

Color.prototype.setSpace = function(space, args) {
   var vals = args[0];
   if (vals === undefined) {
      // color.rgb()
      return this.getValues(space);
   }
   // color.rgb(10, 10, 10)
   if (typeof vals == "number") {
      vals = Array.prototype.slice.call(args);
   }
   this.setValues(space, vals);
   return this;
}

Color.prototype.setChannel = function(space, index, val) {
   if (val === undefined) {
      // color.red()
      return this.values[space][index];
   }
   // color.red(100)
   this.values[space][index] = val;
   this.setValues(space, this.values[space]);
   return this;
}

},{"color-convert":72,"color-string":73}],71:[function(_dereq_,module,exports){
/* MIT license */

module.exports = {
  rgb2hsl: rgb2hsl,
  rgb2hsv: rgb2hsv,
  rgb2cmyk: rgb2cmyk,
  rgb2keyword: rgb2keyword,
  rgb2xyz: rgb2xyz,
  rgb2lab: rgb2lab,

  hsl2rgb: hsl2rgb,
  hsl2hsv: hsl2hsv,
  hsl2cmyk: hsl2cmyk,
  hsl2keyword: hsl2keyword,

  hsv2rgb: hsv2rgb,
  hsv2hsl: hsv2hsl,
  hsv2cmyk: hsv2cmyk,
  hsv2keyword: hsv2keyword,

  cmyk2rgb: cmyk2rgb,
  cmyk2hsl: cmyk2hsl,
  cmyk2hsv: cmyk2hsv,
  cmyk2keyword: cmyk2keyword,
  
  keyword2rgb: keyword2rgb,
  keyword2hsl: keyword2hsl,
  keyword2hsv: keyword2hsv,
  keyword2cmyk: keyword2cmyk,
  
  xyz2rgb: xyz2rgb,
}


function rgb2hsl(rgb) {
  var r = rgb[0]/255,
      g = rgb[1]/255,
      b = rgb[2]/255,
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, l;

  if (max == min)
    h = 0;
  else if (r == max) 
    h = (g - b) / delta; 
  else if (g == max)
    h = 2 + (b - r) / delta; 
  else if (b == max)
    h = 4 + (r - g)/ delta;

  h = Math.min(h * 60, 360);

  if (h < 0)
    h += 360;

  l = (min + max) / 2;

  if (max == min)
    s = 0;
  else if (l <= 0.5)
    s = delta / (max + min);
  else
    s = delta / (2 - max - min);

  return [h, s * 100, l * 100];
}

function rgb2hsv(rgb) {
  var r = rgb[0],
      g = rgb[1],
      b = rgb[2],
      min = Math.min(r, g, b),
      max = Math.max(r, g, b),
      delta = max - min,
      h, s, v;

  if (max == 0)
    s = 0;
  else
    s = (delta/max * 1000)/10;

  if (max == min)
    h = 0;
  else if (r == max) 
    h = (g - b) / delta; 
  else if (g == max)
    h = 2 + (b - r) / delta; 
  else if (b == max)
    h = 4 + (r - g) / delta;

  h = Math.min(h * 60, 360);

  if (h < 0) 
    h += 360;

  v = ((max / 255) * 1000) / 10;

  return [h, s, v];
}

function rgb2cmyk(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      c, m, y, k;
      
  k = Math.min(1 - r, 1 - g, 1 - b);
  c = (1 - r - k) / (1 - k);
  m = (1 - g - k) / (1 - k);
  y = (1 - b - k) / (1 - k);
  return [c * 100, m * 100, y * 100, k * 100];
}

function rgb2keyword(rgb) {
  return reverseKeywords[JSON.stringify(rgb)];
}

function rgb2xyz(rgb) {
  var r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255;

  // assume sRGB
  r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);
  
  var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  return [x * 100, y *100, z * 100];
}

function rgb2lab(rgb) {
  var xyz = rgb2xyz(rgb),
        x = xyz[0],
        y = xyz[1],
        z = xyz[2],
        l, a, b;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

  l = (116 * y) - 16;
  a = 500 * (x - y);
  b = 200 * (y - z);
  
  return [l, a, b];
}


function hsl2rgb(hsl) {
  var h = hsl[0] / 360,
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      t1, t2, t3, rgb, val;

  if (s == 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5)
    t2 = l * (1 + s);
  else
    t2 = l + s - l * s;
  t1 = 2 * l - t2;

  rgb = [0, 0, 0];
  for (var i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * - (i - 1);
    t3 < 0 && t3++;
    t3 > 1 && t3--;

    if (6 * t3 < 1)
      val = t1 + (t2 - t1) * 6 * t3;
    else if (2 * t3 < 1)
      val = t2;
    else if (3 * t3 < 2)
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    else
      val = t1;

    rgb[i] = val * 255;
  }
  
  return rgb;
}

function hsl2hsv(hsl) {
  var h = hsl[0],
      s = hsl[1] / 100,
      l = hsl[2] / 100,
      sv, v;
  l *= 2;
  s *= (l <= 1) ? l : 2 - l;
  v = (l + s) / 2;
  sv = (2 * s) / (l + s);
  return [h, s * 100, v * 100];
}

function hsl2cmyk(args) {
  return rgb2cmyk(hsl2rgb(args));
}

function hsl2keyword(args) {
  return rgb2keyword(hsl2rgb(args));
}


function hsv2rgb(hsv) {
  var h = hsv[0] / 60,
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      hi = Math.floor(h) % 6;

  var f = h - Math.floor(h),
      p = 255 * v * (1 - s),
      q = 255 * v * (1 - (s * f)),
      t = 255 * v * (1 - (s * (1 - f))),
      v = 255 * v;

  switch(hi) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    case 5:
      return [v, p, q];
  }
}

function hsv2hsl(hsv) {
  var h = hsv[0],
      s = hsv[1] / 100,
      v = hsv[2] / 100,
      sl, l;

  l = (2 - s) * v;  
  sl = s * v;
  sl /= (l <= 1) ? l : 2 - l;
  l /= 2;
  return [h, sl * 100, l * 100];
}

function hsv2cmyk(args) {
  return rgb2cmyk(hsv2rgb(args));
}

function hsv2keyword(args) {
  return rgb2keyword(hsv2rgb(args));
}

function cmyk2rgb(cmyk) {
  var c = cmyk[0] / 100,
      m = cmyk[1] / 100,
      y = cmyk[2] / 100,
      k = cmyk[3] / 100,
      r, g, b;

  r = 1 - Math.min(1, c * (1 - k) + k);
  g = 1 - Math.min(1, m * (1 - k) + k);
  b = 1 - Math.min(1, y * (1 - k) + k);
  return [r * 255, g * 255, b * 255];
}

function cmyk2hsl(args) {
  return rgb2hsl(cmyk2rgb(args));
}

function cmyk2hsv(args) {
  return rgb2hsv(cmyk2rgb(args));
}

function cmyk2keyword(args) {
  return rgb2keyword(cmyk2rgb(args));
}


function xyz2rgb(xyz) {
  var x = xyz[0] / 100,
      y = xyz[1] / 100,
      z = xyz[2] / 100,
      r, g, b;

  r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  // assume sRGB
  r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
    : r = (r * 12.92);

  g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
    : g = (g * 12.92);
        
  b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
    : b = (b * 12.92);

  r = (r < 0) ? 0 : r;
  g = (g < 0) ? 0 : g;
  b = (b < 0) ? 0 : b;

  return [r * 255, g * 255, b * 255];
}


function keyword2rgb(keyword) {
  return cssKeywords[keyword];
}

function keyword2hsl(args) {
  return rgb2hsl(keyword2rgb(args));
}

function keyword2hsv(args) {
  return rgb2hsv(keyword2rgb(args));
}

function keyword2cmyk(args) {
  return rgb2cmyk(keyword2rgb(args));
}

var cssKeywords = {
  aliceblue:  [240,248,255],
  antiquewhite: [250,235,215],
  aqua: [0,255,255],
  aquamarine: [127,255,212],
  azure:  [240,255,255],
  beige:  [245,245,220],
  bisque: [255,228,196],
  black:  [0,0,0],
  blanchedalmond: [255,235,205],
  blue: [0,0,255],
  blueviolet: [138,43,226],
  brown:  [165,42,42],
  burlywood:  [222,184,135],
  cadetblue:  [95,158,160],
  chartreuse: [127,255,0],
  chocolate:  [210,105,30],
  coral:  [255,127,80],
  cornflowerblue: [100,149,237],
  cornsilk: [255,248,220],
  crimson:  [220,20,60],
  cyan: [0,255,255],
  darkblue: [0,0,139],
  darkcyan: [0,139,139],
  darkgoldenrod:  [184,134,11],
  darkgray: [169,169,169],
  darkgreen:  [0,100,0],
  darkgrey: [169,169,169],
  darkkhaki:  [189,183,107],
  darkmagenta:  [139,0,139],
  darkolivegreen: [85,107,47],
  darkorange: [255,140,0],
  darkorchid: [153,50,204],
  darkred:  [139,0,0],
  darksalmon: [233,150,122],
  darkseagreen: [143,188,143],
  darkslateblue:  [72,61,139],
  darkslategray:  [47,79,79],
  darkslategrey:  [47,79,79],
  darkturquoise:  [0,206,209],
  darkviolet: [148,0,211],
  deeppink: [255,20,147],
  deepskyblue:  [0,191,255],
  dimgray:  [105,105,105],
  dimgrey:  [105,105,105],
  dodgerblue: [30,144,255],
  firebrick:  [178,34,34],
  floralwhite:  [255,250,240],
  forestgreen:  [34,139,34],
  fuchsia:  [255,0,255],
  gainsboro:  [220,220,220],
  ghostwhite: [248,248,255],
  gold: [255,215,0],
  goldenrod:  [218,165,32],
  gray: [128,128,128],
  green:  [0,128,0],
  greenyellow:  [173,255,47],
  grey: [128,128,128],
  honeydew: [240,255,240],
  hotpink:  [255,105,180],
  indianred:  [205,92,92],
  indigo: [75,0,130],
  ivory:  [255,255,240],
  khaki:  [240,230,140],
  lavender: [230,230,250],
  lavenderblush:  [255,240,245],
  lawngreen:  [124,252,0],
  lemonchiffon: [255,250,205],
  lightblue:  [173,216,230],
  lightcoral: [240,128,128],
  lightcyan:  [224,255,255],
  lightgoldenrodyellow: [250,250,210],
  lightgray:  [211,211,211],
  lightgreen: [144,238,144],
  lightgrey:  [211,211,211],
  lightpink:  [255,182,193],
  lightsalmon:  [255,160,122],
  lightseagreen:  [32,178,170],
  lightskyblue: [135,206,250],
  lightslategray: [119,136,153],
  lightslategrey: [119,136,153],
  lightsteelblue: [176,196,222],
  lightyellow:  [255,255,224],
  lime: [0,255,0],
  limegreen:  [50,205,50],
  linen:  [250,240,230],
  magenta:  [255,0,255],
  maroon: [128,0,0],
  mediumaquamarine: [102,205,170],
  mediumblue: [0,0,205],
  mediumorchid: [186,85,211],
  mediumpurple: [147,112,219],
  mediumseagreen: [60,179,113],
  mediumslateblue:  [123,104,238],
  mediumspringgreen:  [0,250,154],
  mediumturquoise:  [72,209,204],
  mediumvioletred:  [199,21,133],
  midnightblue: [25,25,112],
  mintcream:  [245,255,250],
  mistyrose:  [255,228,225],
  moccasin: [255,228,181],
  navajowhite:  [255,222,173],
  navy: [0,0,128],
  oldlace:  [253,245,230],
  olive:  [128,128,0],
  olivedrab:  [107,142,35],
  orange: [255,165,0],
  orangered:  [255,69,0],
  orchid: [218,112,214],
  palegoldenrod:  [238,232,170],
  palegreen:  [152,251,152],
  paleturquoise:  [175,238,238],
  palevioletred:  [219,112,147],
  papayawhip: [255,239,213],
  peachpuff:  [255,218,185],
  peru: [205,133,63],
  pink: [255,192,203],
  plum: [221,160,221],
  powderblue: [176,224,230],
  purple: [128,0,128],
  red:  [255,0,0],
  rosybrown:  [188,143,143],
  royalblue:  [65,105,225],
  saddlebrown:  [139,69,19],
  salmon: [250,128,114],
  sandybrown: [244,164,96],
  seagreen: [46,139,87],
  seashell: [255,245,238],
  sienna: [160,82,45],
  silver: [192,192,192],
  skyblue:  [135,206,235],
  slateblue:  [106,90,205],
  slategray:  [112,128,144],
  slategrey:  [112,128,144],
  snow: [255,250,250],
  springgreen:  [0,255,127],
  steelblue:  [70,130,180],
  tan:  [210,180,140],
  teal: [0,128,128],
  thistle:  [216,191,216],
  tomato: [255,99,71],
  turquoise:  [64,224,208],
  violet: [238,130,238],
  wheat:  [245,222,179],
  white:  [255,255,255],
  whitesmoke: [245,245,245],
  yellow: [255,255,0],
  yellowgreen:  [154,205,50]
};

var reverseKeywords = {};
for (var key in cssKeywords) {
  reverseKeywords[JSON.stringify(cssKeywords[key])] = key;
}

},{}],72:[function(_dereq_,module,exports){
var conversions = _dereq_("./conversions");

var exports = {};
module.exports = exports;

for (var func in conversions) {
  // export rgb2hslRaw
  exports[func + "Raw"] =  (function(func) {
    // accept array or plain args
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      return conversions[func](arg);
    }
  })(func);

  var pair = /(\w+)2(\w+)/.exec(func),
      from = pair[1],
      to = pair[2];

  // export rgb2hsl and ["rgb"]["hsl"]
  exports[from] = exports[from] || {};

  exports[from][to] = exports[func] = (function(func) { 
    return function(arg) {
      if (typeof arg == "number")
        arg = Array.prototype.slice.call(arguments);
      
      var val = conversions[func](arg);
      if (typeof val == "string" || val === undefined)
        return val; // keyword

      for (var i = 0; i < val.length; i++)
        val[i] = Math.round(val[i]);
      return val;
    }
  })(func);
}
},{"./conversions":71}],73:[function(_dereq_,module,exports){
/* MIT license */
var convert = _dereq_("color-convert");

module.exports = {
   getRgba: getRgba,
   getHsla: getHsla,
   getRgb: getRgb,
   getHsl: getHsl,
   getAlpha: getAlpha,

   hexString: hexString,
   rgbString: rgbString,
   rgbaString: rgbaString,
   percentString: percentString,
   percentaString: percentaString,
   hslString: hslString,
   hslaString: hslaString,
   keyword: keyword
}

function getRgba(string) {
   if (!string) {
      return;
   }
   var abbr =  /^#([a-fA-F0-9]{3})$/,
       hex =  /^#([a-fA-F0-9]{6})$/,
       rgba = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d\.]+)\s*)?\)$/,
       per = /^rgba?\(\s*([\d\.]+)\%\s*,\s*([\d\.]+)\%\s*,\s*([\d\.]+)\%\s*(?:,\s*([\d\.]+)\s*)?\)$/,
       keyword = /(\D+)/;

   var rgb = [0, 0, 0],
       a = 1,
       match = string.match(abbr);
   if (match) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i] + match[i], 16);
      }
   }
   else if (match = string.match(hex)) {
      match = match[1];
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match.slice(i * 2, i * 2 + 2), 16);
      }
   }
   else if (match = string.match(rgba)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = parseInt(match[i + 1]);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(per)) {
      for (var i = 0; i < rgb.length; i++) {
         rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
      }
      a = parseFloat(match[4]);
   }
   else if (match = string.match(keyword)) {
      if (match[1] == "transparent") {
         return [0, 0, 0, 0];
      }
      rgb = convert.keyword2rgb(match[1]);
      if (!rgb) {
         return;
      }
   }

   for (var i = 0; i < rgb.length; i++) {
      rgb[i] = scale(rgb[i], 0, 255);
   }
   if (!a && a != 0) {
      a = 1;
   }
   else {
      a = scale(a, 0, 1);
   }
   rgb.push(a);
   return rgb;
}

function getHsla(string) {
   if (!string) {
      return;
   }
   var hsl = /^hsla?\(\s*(\d+)\s*,\s*([\d\.]+)%\s*,\s*([\d\.]+)%\s*(?:,\s*([\d\.]+)\s*)?\)/;
   var match = string.match(hsl);
   if (match) {
      var h = scale(parseInt(match[1]), 0, 360),
          s = scale(parseFloat(match[2]), 0, 100),
          l = scale(parseFloat(match[3]), 0, 100),
          a = scale(parseFloat(match[4]) || 1, 0, 1);
      return [h, s, l, a];
   }
}

function getRgb(string) {
   return getRgba(string).slice(0, 3);
}

function getHsl(string) {
   return getHsla(string).slice(0, 3);
}

function getAlpha(string) {
   var vals = getRgba(string);
   if (vals) {
      return vals[3];
   }
   else if (vals = getHsla(string)) {
      return vals[3];
   }
}

// generators
function hexString(rgb) {
   return "#" + hexDouble(rgb[0]) + hexDouble(rgb[1])
              + hexDouble(rgb[2]);
}

function rgbString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return rgbaString(rgba, alpha);
   }
   return "rgb(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2] + ")";
}

function rgbaString(rgba, alpha) {
   if (alpha === undefined) {
      alpha = (rgba[3] !== undefined ? rgba[3] : 1);
   }
   return "rgba(" + rgba[0] + ", " + rgba[1] + ", " + rgba[2]
           + ", " + alpha + ")";
}

function percentString(rgba, alpha) {
   if (alpha < 1 || (rgba[3] && rgba[3] < 1)) {
      return percentaString(rgba, alpha);
   }
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);

   return "rgb(" + r + "%, " + g + "%, " + b + "%)";
}

function percentaString(rgba, alpha) {
   var r = Math.round(rgba[0]/255 * 100),
       g = Math.round(rgba[1]/255 * 100),
       b = Math.round(rgba[2]/255 * 100);
   return "rgba(" + r + "%, " + g + "%, " + b + "%, " + (alpha || rgba[3] || 1) + ")";
}

function hslString(hsla, alpha) {
   if (alpha < 1 || (hsla[3] && hsla[3] < 1)) {
      return hslaString(hsla, alpha);
   }
   return "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)";
}

function hslaString(hsla, alpha) {
   if (alpha === undefined) {
      alpha = (hsla[3] !== undefined ? hsla[3] : 1);
   }
   return "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, "
           + alpha + ")";
}

function keyword(rgb) {
   return convert.rgb2keyword(rgb.slice(0, 3));
}

// helpers
function scale(num, min, max) {
   return Math.min(Math.max(min, num), max);
}

function hexDouble(num) {
  var str = num.toString(16).toUpperCase();
  return (str.length < 2) ? "0" + str : str;
}

},{"color-convert":72}],74:[function(_dereq_,module,exports){

/**
 * Expose `debug()` as the module.
 */

module.exports = debug;

/**
 * Create a debugger with the given `name`.
 *
 * @param {String} name
 * @return {Type}
 * @api public
 */

function debug(name) {
  if (!debug.enabled(name)) return function(){};

  return function(fmt){
    fmt = coerce(fmt);

    var curr = new Date;
    var ms = curr - (debug[name] || curr);
    debug[name] = curr;

    fmt = name
      + ' '
      + fmt
      + ' +' + debug.humanize(ms);

    // This hackery is required for IE8
    // where `console.log` doesn't have 'apply'
    window.console
      && console.log
      && Function.prototype.apply.call(console.log, console, arguments);
  }
}

/**
 * The currently active debug mode names.
 */

debug.names = [];
debug.skips = [];

/**
 * Enables a debug mode by name. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} name
 * @api public
 */

debug.enable = function(name) {
  try {
    localStorage.debug = name;
  } catch(e){}

  var split = (name || '').split(/[\s,]+/)
    , len = split.length;

  for (var i = 0; i < len; i++) {
    name = split[i].replace('*', '.*?');
    if (name[0] === '-') {
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
    }
    else {
      debug.names.push(new RegExp('^' + name + '$'));
    }
  }
};

/**
 * Disable debug output.
 *
 * @api public
 */

debug.disable = function(){
  debug.enable('');
};

/**
 * Humanize the given `ms`.
 *
 * @param {Number} m
 * @return {String}
 * @api private
 */

debug.humanize = function(ms) {
  var sec = 1000
    , min = 60 * 1000
    , hour = 60 * min;

  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
  if (ms >= min) return (ms / min).toFixed(1) + 'm';
  if (ms >= sec) return (ms / sec | 0) + 's';
  return ms + 'ms';
};

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

debug.enabled = function(name) {
  for (var i = 0, len = debug.skips.length; i < len; i++) {
    if (debug.skips[i].test(name)) {
      return false;
    }
  }
  for (var i = 0, len = debug.names.length; i < len; i++) {
    if (debug.names[i].test(name)) {
      return true;
    }
  }
  return false;
};

/**
 * Coerce `val`.
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

// persist

try {
  if (window.localStorage) debug.enable(localStorage.debug);
} catch(e){}

},{}],75:[function(_dereq_,module,exports){

var properties = _dereq_('./properties');


/**
 * Expose `plugin`.
 */

module.exports = plugin;


/**
 * Convert `font-variant-*` properties into their open-type equivalents.
 *
 * @param {Object} stylesheet
 */

function plugin (stylesheet) {
  stylesheet.rules.forEach(function (rule) {
    if (!rule.declarations) return;
    var decs = [];
    rule.declarations.forEach(function (dec, i) {
      var value = variant(dec.property, dec.value);
      if (value) decs.push(value);
      decs.push(dec);
    });
    rule.declarations = decs;
  });
}


/**
 * Convert a `font-variant-*` property.
 *
 * @param {String} property
 * @param {String} value
 */

function variant (property, value) {
  if (!properties[property]) return null;

  var features = 'font-variant' == property
    ? shorthand(value)
    : properties[property][value];

  return {
    type: 'declaration',
    property: 'font-feature-settings',
    value: features
  };
}


/**
 * Convert the `font-variant` shorthand property.
 *
 * @param {String} value
 */

function shorthand (value) {
  var values = value.split(/\s+/g);
  return values.map(function (val) {
    return properties['font-variant'][val];
  }).join(', ');
}
},{"./properties":76}],76:[function(_dereq_,module,exports){

/**
 * The `font-variant-ligatures` property.
 */

exports['font-variant-ligatures'] = {
  'common-ligatures'           : '"liga", "clig"',
  'no-common-ligatures'        : '"liga", "clig off"',
  'discretionary-ligatures'    : '"dlig"',
  'no-discretionary-ligatures' : '"dlig" off',
  'historical-ligatures'       : '"hlig"',
  'no-historical-ligatures'    : '"hlig" off',
  'contextual'                 : '"calt"',
  'no-contextual'              : '"calt" off'
};

/**
 * The `font-variant-position` property.
 */

exports['font-variant-position'] = {
  'sub'   : '"subs"',
  'super' : '"sups"'
};

/**
 * The `font-variant-caps` property.
 */

exports['font-variant-caps'] = {
  'small-caps'      : '"c2sc"',
  'all-small-caps'  : '"smcp", "c2sc"',
  'petite-caps'     : '"pcap"',
  'all-petite-caps' : '"pcap", "c2pc"',
  'unicase'         : '"unic"',
  'titling-caps'    : '"titl"'
};

/**
 * The `font-variant-numeric` property.
 */

exports['font-variant-numeric'] = {
  'lining-nums'        : '"lnum"',
  'oldstyle-nums'      : '"onum"',
  'proportional-nums'  : '"pnum"',
  'tabular-nums'       : '"tnum"',
  'diagonal-fractions' : '"frac"',
  'stacked-fractions'  : '"afrc"',
  'ordinal'            : '"ordn"',
  'slashed-zero'       : '"zero"'
};


/**
 * The `font-variant` property is a shorthand for all the others.
 */

exports['font-variant'] = {};

for (var prop in exports) {
  var keys = exports[prop];
  for (var key in keys) {
    exports['font-variant'][key] = keys[key];
  }
}
},{}],77:[function(_dereq_,module,exports){

var convert = _dereq_('rgb');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Hex alpha pattern matcher.
 */

var pattern = /(#[0-9a-f]{4}(?:[0-9a-f]{4})?)\b/i;

/**
 * Plugin to convert hex colors with alpha values into their RGBA equivalents
 * for more browser support.
 *
 * @param {Object} stylesheet
 */

function plugin(stylesheet){
  stylesheet.rules.forEach(rule);
}

/**
 * Convert a rule.
 *
 * @param {Object} obj
 * @param {Number} i
 */

function rule(obj, i){
  if (obj.declarations) obj.declarations.forEach(declaration);
  if (obj.rules) obj.rules.forEach(rule);
}

/**
 * Convert a declaration.
 *
 * @param {Object} obj
 * @param {Number} i
 */

function declaration(obj, i){
  var val = obj.value;
  if (!val) return;
  var m = pattern.exec(val);
  if (!m) return;

  var hex = m[1];
  var rgb = convert(hex);
  var i = val.indexOf(hex);
  var l = hex.length;
  obj.value = val.slice(0, i) + rgb + val.slice(i + l);
}
},{"rgb":78}],78:[function(_dereq_,module,exports){
/*
color
*/"use strict"

var colors = {
    maroon      : "#800000",
    red         : "#ff0000",
    orange      : "#ffA500",
    yellow      : "#ffff00",
    olive       : "#808000",
    purple      : "#800080",
    fuchsia     : "#ff00ff",
    white       : "#ffffff",
    lime        : "#00ff00",
    green       : "#008000",
    navy        : "#000080",
    blue        : "#0000ff",
    aqua        : "#00ffff",
    teal        : "#008080",
    black       : "#000000",
    silver      : "#c0c0c0",
    gray        : "#808080",
    transparent : "#0000"
}

var RGBtoRGB = function(r, g, b, a){
    if (a == null || a === "") a = 1
    r = parseFloat(r)
    g = parseFloat(g)
    b = parseFloat(b)
    a = parseFloat(a)
    if (!(r <= 255 && r >= 0 && g <= 255 && g >= 0 && b <= 255 && b >= 0 && a <= 1 && a >= 0)) return null

    return [Math.round(r), Math.round(g), Math.round(b), a]
}

var HEXtoRGB = function(hex){
    if (hex.length === 3) hex += "f"
    if (hex.length === 4){
        var h0 = hex.charAt(0),
            h1 = hex.charAt(1),
            h2 = hex.charAt(2),
            h3 = hex.charAt(3)

        hex = h0 + h0 + h1 + h1 + h2 + h2 + h3 + h3
    }
    if (hex.length === 6) hex += "ff"
    var rgb = []
    for (var i = 0, l = hex.length; i < l; i += 2) rgb.push(parseInt(hex.substr(i, 2), 16) / (i === 6 ? 255 : 1))
    return rgb
}

// HSL to RGB conversion from:
// http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
// thank you!

var HUEtoRGB = function(p, q, t){
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
}

var HSLtoRGB = function(h, s, l, a){
    var r, b, g
    if (a == null || a === "") a = 1
    h = parseFloat(h) / 360
    s = parseFloat(s) / 100
    l = parseFloat(l) / 100
    a = parseFloat(a) / 1
    if (h > 1 || h < 0 || s > 1 || s < 0 || l > 1 || l < 0 || a > 1 || a < 0) return null
    if (s === 0){
        r = b = g = l
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s
        var p = 2 * l - q
        r = HUEtoRGB(p, q, h + 1 / 3)
        g = HUEtoRGB(p, q, h)
        b = HUEtoRGB(p, q, h - 1 / 3)
    }
    return [r * 255, g * 255, b * 255, a]
}

var keys = []
for (var c in colors) keys.push(c)

var shex  = "(?:#([a-f0-9]{3,8}))",
    sval  = "\\s*([.\\d%]+)\\s*",
    sop   = "(?:,\\s*([.\\d]+)\\s*)?",
    slist = "\\(" + [sval, sval, sval] + sop + "\\)",
    srgb  = "(?:rgb)a?",
    shsl  = "(?:hsl)a?",
    skeys = "(" + keys.join("|") + ")"


var xhex   = RegExp(shex, "i"),
    xrgb   = RegExp(srgb + slist, "i"),
    xhsl   = RegExp(shsl + slist, "i")

var color = function(input, array){
    if (input == null) return null
    input = (input + "").replace(/\s+/, "")

    var match = colors[input]
    if (match){
        return color(match, array)
    } else if (match = input.match(xhex)){
        input = HEXtoRGB(match[1])
    } else if (match = input.match(xrgb)){
        input = match.slice(1)
    } else if (match = input.match(xhsl)){
        input = HSLtoRGB.apply(null, match.slice(1))
    } else return null

    if (!(input && (input = RGBtoRGB.apply(null, input)))) return null
    if (array) return input
    if (input[3] === 1) input.splice(3, 1)
    return "rgb" + (input.length === 4 ? "a" : "") + "(" + input + ")"
}

var regexp = RegExp([skeys, shex, srgb + slist, shsl + slist].join("|"), "gi")

color.replace = function(string, method){
    if (!method) method = function(match){
        return color(match)
    }
    return (string + "").replace(regexp, method)
}

color.matches = function(string){
    return !!(string + "").match(regexp)
}

module.exports = color

},{}],79:[function(_dereq_,module,exports){
(function (process){
'use strict';

var css = _dereq_('css');
var findFile = _dereq_('find-file');
var fs = _dereq_('fs');
var parseImport = _dereq_('parse-import');

/**
 * Inline stylesheet using `@import`
 *
 * @param {Object} style
 * @param {Object} opts
 * @api public
 */

function Import(style, opts) {
    opts = opts || {};
    this.opts = opts;
    this.path = opts.path || process.cwd();
    this.rules = style.rules || [];
}

/**
 * Process stylesheet
 *
 * @api public
 */

Import.prototype.process = function () {
    var rules = [];
    var self = this;

    this.rules.forEach(function (rule) {
        if (rule.type !== 'import') {
            return rules.push(rule);
        }

        var data = parseImport(rule.import);
        var file = self._check(data.path);
        var media = data.condition;
        var res;
        var content = self._read(file);

        parseStyle(content, self.opts)

        if (!media || !media.length) {
            res = content.rules;
        } else {
            res = {
                type: 'media',
                media: media,
                rules: content.rules
            };
        }

        rules = rules.concat(res);
    });

    return rules;
};

/**
 * Read the contents of a file
 *
 * @param {String} file
 * @api private
 */

Import.prototype._read = function (file) {
    var data = fs.readFileSync(file, this.opts.encoding || 'utf8');
    var style = css.parse(data).stylesheet;

    return style;
};

/**
 * Check if a file exists
 *
 * @param {String} name
 * @api private
 */

Import.prototype._check = function (name) {
    var file = findFile(name, { path: this.path, global: false });

    if (!file) {
        throw new Error('failed to find ' + name);
    }

    return file[0];
};

/**
 * Parse @import in given style
 *
 * @param {Object} style
 * @param {Object} opts
 */
function parseStyle(style, opts) {
    var inline = new Import(style, opts);
    var rules = inline.process();

    style.rules = rules;
}


/**
 * Module exports
 */

module.exports = function (opts) {
    return function (style) {
        parseStyle(style, opts)
    };
};

}).call(this,_dereq_("FWaASH"))
},{"FWaASH":61,"css":80,"find-file":97,"fs":56,"parse-import":98}],80:[function(_dereq_,module,exports){

exports.parse = _dereq_('css-parse');
exports.stringify = _dereq_('css-stringify');

},{"css-parse":81,"css-stringify":82}],81:[function(_dereq_,module,exports){

module.exports = function(css, options){
  options = options || {};

  /**
   * Positional.
   */

  var lineno = 1;
  var column = 1;

  /**
   * Update lineno and column based on `str`.
   */

  function updatePosition(str) {
    var lines = str.match(/\n/g);
    if (lines) lineno += lines.length;
    var i = str.lastIndexOf('\n');
    column = ~i ? str.length - i : column + str.length;
  }

  /**
   * Mark position and patch `node.position`.
   */

  function position() {
    var start = { line: lineno, column: column };
    if (!options.position) return positionNoop;

    return function(node){
      node.position = {
        start: start,
        end: { line: lineno, column: column },
        source: options.source
      };

      whitespace();
      return node;
    }
  }

  /**
   * Return `node`.
   */

  function positionNoop(node) {
    whitespace();
    return node;
  }

  /**
   * Error `msg`.
   */

  function error(msg) {
    var err = new Error(msg + ' near line ' + lineno + ':' + column);
    err.filename = options.source;
    err.line = lineno;
    err.column = column;
    err.source = css;
    throw err;
  }

  /**
   * Parse stylesheet.
   */

  function stylesheet() {
    return {
      type: 'stylesheet',
      stylesheet: {
        rules: rules()
      }
    };
  }

  /**
   * Opening brace.
   */

  function open() {
    return match(/^{\s*/);
  }

  /**
   * Closing brace.
   */

  function close() {
    return match(/^}/);
  }

  /**
   * Parse ruleset.
   */

  function rules() {
    var node;
    var rules = [];
    whitespace();
    comments(rules);
    while (css.charAt(0) != '}' && (node = atrule() || rule())) {
      rules.push(node);
      comments(rules);
    }
    return rules;
  }

  /**
   * Match `re` and return captures.
   */

  function match(re) {
    var m = re.exec(css);
    if (!m) return;
    var str = m[0];
    updatePosition(str);
    css = css.slice(str.length);
    return m;
  }

  /**
   * Parse whitespace.
   */

  function whitespace() {
    match(/^\s*/);
  }

  /**
   * Parse comments;
   */

  function comments(rules) {
    var c;
    rules = rules || [];
    while (c = comment()) rules.push(c);
    return rules;
  }

  /**
   * Parse comment.
   */

  function comment() {
    var pos = position();
    if ('/' != css.charAt(0) || '*' != css.charAt(1)) return;

    var i = 2;
    while (null != css.charAt(i) && ('*' != css.charAt(i) || '/' != css.charAt(i + 1))) ++i;
    i += 2;

    var str = css.slice(2, i - 2);
    column += 2;
    updatePosition(str);
    css = css.slice(i);
    column += 2;

    return pos({
      type: 'comment',
      comment: str
    });
  }

  /**
   * Parse selector.
   */

  function selector() {
    var m = match(/^([^{]+)/);
    if (!m) return;
    return trim(m[0]).split(/\s*,\s*/);
  }

  /**
   * Parse declaration.
   */

  function declaration() {
    var pos = position();

    // prop
    var prop = match(/^(\*?[-#\/\*\w]+(\[[0-9a-z_-]+\])?)\s*/);
    if (!prop) return;
    prop = trim(prop[0]);

    // :
    if (!match(/^:\s*/)) return error("property missing ':'");

    // val
    var val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);
    if (!val) return error('property missing value');

    var ret = pos({
      type: 'declaration',
      property: prop,
      value: trim(val[0])
    });

    // ;
    match(/^[;\s]*/);

    return ret;
  }

  /**
   * Parse declarations.
   */

  function declarations() {
    var decls = [];

    if (!open()) return error("missing '{'");
    comments(decls);

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      comments(decls);
    }

    if (!close()) return error("missing '}'");
    return decls;
  }

  /**
   * Parse keyframe.
   */

  function keyframe() {
    var m;
    var vals = [];
    var pos = position();

    while (m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/)) {
      vals.push(m[1]);
      match(/^,\s*/);
    }

    if (!vals.length) return;

    return pos({
      type: 'keyframe',
      values: vals,
      declarations: declarations()
    });
  }

  /**
   * Parse keyframes.
   */

  function atkeyframes() {
    var pos = position();
    var m = match(/^@([-\w]+)?keyframes */);

    if (!m) return;
    var vendor = m[1];

    // identifier
    var m = match(/^([-\w]+)\s*/);
    if (!m) return error("@keyframes missing name");
    var name = m[1];

    if (!open()) return error("@keyframes missing '{'");

    var frame;
    var frames = comments();
    while (frame = keyframe()) {
      frames.push(frame);
      frames = frames.concat(comments());
    }

    if (!close()) return error("@keyframes missing '}'");

    return pos({
      type: 'keyframes',
      name: name,
      vendor: vendor,
      keyframes: frames
    });
  }

  /**
   * Parse supports.
   */

  function atsupports() {
    var pos = position();
    var m = match(/^@supports *([^{]+)/);

    if (!m) return;
    var supports = trim(m[1]);

    if (!open()) return error("@supports missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@supports missing '}'");

    return pos({
      type: 'supports',
      supports: supports,
      rules: style
    });
  }

  /**
   * Parse host.
   */

  function athost() {
    var pos = position();
    var m = match(/^@host */);

    if (!m) return;

    if (!open()) return error("@host missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@host missing '}'");

    return pos({
      type: 'host',
      rules: style
    });
  }

  /**
   * Parse media.
   */

  function atmedia() {
    var pos = position();
    var m = match(/^@media *([^{]+)/);

    if (!m) return;
    var media = trim(m[1]);

    if (!open()) return error("@media missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@media missing '}'");

    return pos({
      type: 'media',
      media: media,
      rules: style
    });
  }

  /**
   * Parse paged media.
   */

  function atpage() {
    var pos = position();
    var m = match(/^@page */);
    if (!m) return;

    var sel = selector() || [];

    if (!open()) return error("@page missing '{'");
    var decls = comments();

    // declarations
    var decl;
    while (decl = declaration()) {
      decls.push(decl);
      decls = decls.concat(comments());
    }

    if (!close()) return error("@page missing '}'");

    return pos({
      type: 'page',
      selectors: sel,
      declarations: decls
    });
  }

  /**
   * Parse document.
   */

  function atdocument() {
    var pos = position();
    var m = match(/^@([-\w]+)?document *([^{]+)/);
    if (!m) return;

    var vendor = trim(m[1]);
    var doc = trim(m[2]);

    if (!open()) return error("@document missing '{'");

    var style = comments().concat(rules());

    if (!close()) return error("@document missing '}'");

    return pos({
      type: 'document',
      document: doc,
      vendor: vendor,
      rules: style
    });
  }

  /**
   * Parse import
   */

  function atimport() {
    return _atrule('import');
  }

  /**
   * Parse charset
   */

  function atcharset() {
    return _atrule('charset');
  }

  /**
   * Parse namespace
   */

  function atnamespace() {
    return _atrule('namespace')
  }

  /**
   * Parse non-block at-rules
   */

  function _atrule(name) {
    var pos = position();
    var m = match(new RegExp('^@' + name + ' *([^;\\n]+);'));
    if (!m) return;
    var ret = { type: name };
    ret[name] = trim(m[1]);
    return pos(ret);
  }

  /**
   * Parse at rule.
   */

  function atrule() {
    if (css[0] != '@') return;

    return atkeyframes()
      || atmedia()
      || atsupports()
      || atimport()
      || atcharset()
      || atnamespace()
      || atdocument()
      || atpage()
      || athost();
  }

  /**
   * Parse rule.
   */

  function rule() {
    var pos = position();
    var sel = selector();

    if (!sel) return;
    comments();

    return pos({
      type: 'rule',
      selectors: sel,
      declarations: declarations()
    });
  }

  return stylesheet();
};

/**
 * Trim `str`.
 */

function trim(str) {
  return str ? str.replace(/^\s+|\s+$/g, '') : '';
}

},{}],82:[function(_dereq_,module,exports){
module.exports=_dereq_(41)
},{"./lib/compress":84,"./lib/identity":85,"./lib/source-map-support":86}],83:[function(_dereq_,module,exports){
module.exports=_dereq_(42)
},{}],84:[function(_dereq_,module,exports){
module.exports=_dereq_(43)
},{"./compiler":83}],85:[function(_dereq_,module,exports){
module.exports=_dereq_(44)
},{"./compiler":83}],86:[function(_dereq_,module,exports){
module.exports=_dereq_(45)
},{"source-map":87}],87:[function(_dereq_,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"./source-map/source-map-consumer":92,"./source-map/source-map-generator":93,"./source-map/source-node":94}],88:[function(_dereq_,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"./util":95,"amdefine":96}],89:[function(_dereq_,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"./base64":90,"amdefine":96}],90:[function(_dereq_,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"amdefine":96}],91:[function(_dereq_,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"amdefine":96}],92:[function(_dereq_,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"./array-set":88,"./base64-vlq":89,"./binary-search":91,"./util":95,"amdefine":96}],93:[function(_dereq_,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"./array-set":88,"./base64-vlq":89,"./util":95,"amdefine":96}],94:[function(_dereq_,module,exports){
arguments[4][53][0].apply(exports,arguments)
},{"./source-map-generator":93,"./util":95,"amdefine":96}],95:[function(_dereq_,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"amdefine":96}],96:[function(_dereq_,module,exports){
(function (process,__filename){
/** vim: et:ts=4:sw=4:sts=4
 * @license amdefine 0.1.0 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/amdefine for details
 */

/*jslint node: true */
/*global module, process */
'use strict';

/**
 * Creates a define for node.
 * @param {Object} module the "module" object that is defined by Node for the
 * current module.
 * @param {Function} [requireFn]. Node's require function for the current module.
 * It only needs to be passed in Node versions before 0.5, when module.require
 * did not exist.
 * @returns {Function} a define function that is usable for the current node
 * module.
 */
function amdefine(module, requireFn) {
    'use strict';
    var defineCache = {},
        loaderCache = {},
        alreadyCalled = false,
        path = _dereq_('path'),
        makeRequire, stringRequire;

    /**
     * Trims the . and .. from an array of path segments.
     * It will keep a leading path segment if a .. will become
     * the first path segment, to help with module name lookups,
     * which act like paths, but can be remapped. But the end result,
     * all paths that use this function should look normalized.
     * NOTE: this method MODIFIES the input array.
     * @param {Array} ary the array of path segments.
     */
    function trimDots(ary) {
        var i, part;
        for (i = 0; ary[i]; i+= 1) {
            part = ary[i];
            if (part === '.') {
                ary.splice(i, 1);
                i -= 1;
            } else if (part === '..') {
                if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                    //End of the line. Keep at least one non-dot
                    //path segment at the front so it can be mapped
                    //correctly to disk. Otherwise, there is likely
                    //no path mapping for a path starting with '..'.
                    //This can still fail, but catches the most reasonable
                    //uses of ..
                    break;
                } else if (i > 0) {
                    ary.splice(i - 1, 2);
                    i -= 2;
                }
            }
        }
    }

    function normalize(name, baseName) {
        var baseParts;

        //Adjust any relative paths.
        if (name && name.charAt(0) === '.') {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                baseParts = baseName.split('/');
                baseParts = baseParts.slice(0, baseParts.length - 1);
                baseParts = baseParts.concat(name.split('/'));
                trimDots(baseParts);
                name = baseParts.join('/');
            }
        }

        return name;
    }

    /**
     * Create the normalize() function passed to a loader plugin's
     * normalize method.
     */
    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(id) {
        function load(value) {
            loaderCache[id] = value;
        }

        load.fromText = function (id, text) {
            //This one is difficult because the text can/probably uses
            //define, and any relative paths and requires should be relative
            //to that id was it would be found on disk. But this would require
            //bootstrapping a module/require fairly deeply from node core.
            //Not sure how best to go about that yet.
            throw new Error('amdefine does not implement load.fromText');
        };

        return load;
    }

    makeRequire = function (systemRequire, exports, module, relId) {
        function amdRequire(deps, callback) {
            if (typeof deps === 'string') {
                //Synchronous, single module require('')
                return stringRequire(systemRequire, exports, module, deps, relId);
            } else {
                //Array of dependencies with a callback.

                //Convert the dependencies to modules.
                deps = deps.map(function (depName) {
                    return stringRequire(systemRequire, exports, module, depName, relId);
                });

                //Wait for next tick to call back the require call.
                process.nextTick(function () {
                    callback.apply(null, deps);
                });
            }
        }

        amdRequire.toUrl = function (filePath) {
            if (filePath.indexOf('.') === 0) {
                return normalize(filePath, path.dirname(module.filename));
            } else {
                return filePath;
            }
        };

        return amdRequire;
    };

    //Favor explicit value, passed in if the module wants to support Node 0.4.
    requireFn = requireFn || function req() {
        return module.require.apply(module, arguments);
    };

    function runFactory(id, deps, factory) {
        var r, e, m, result;

        if (id) {
            e = loaderCache[id] = {};
            m = {
                id: id,
                uri: __filename,
                exports: e
            };
            r = makeRequire(requireFn, e, m, id);
        } else {
            //Only support one define call per file
            if (alreadyCalled) {
                throw new Error('amdefine with no module ID cannot be called more than once per file.');
            }
            alreadyCalled = true;

            //Use the real variables from node
            //Use module.exports for exports, since
            //the exports in here is amdefine exports.
            e = module.exports;
            m = module;
            r = makeRequire(requireFn, e, m, module.id);
        }

        //If there are dependencies, they are strings, so need
        //to convert them to dependency values.
        if (deps) {
            deps = deps.map(function (depName) {
                return r(depName);
            });
        }

        //Call the factory with the right dependencies.
        if (typeof factory === 'function') {
            result = factory.apply(m.exports, deps);
        } else {
            result = factory;
        }

        if (result !== undefined) {
            m.exports = result;
            if (id) {
                loaderCache[id] = m.exports;
            }
        }
    }

    stringRequire = function (systemRequire, exports, module, id, relId) {
        //Split the ID by a ! so that
        var index = id.indexOf('!'),
            originalId = id,
            prefix, plugin;

        if (index === -1) {
            id = normalize(id, relId);

            //Straight module lookup. If it is one of the special dependencies,
            //deal with it, otherwise, delegate to node.
            if (id === 'require') {
                return makeRequire(systemRequire, exports, module, relId);
            } else if (id === 'exports') {
                return exports;
            } else if (id === 'module') {
                return module;
            } else if (loaderCache.hasOwnProperty(id)) {
                return loaderCache[id];
            } else if (defineCache[id]) {
                runFactory.apply(null, defineCache[id]);
                return loaderCache[id];
            } else {
                if(systemRequire) {
                    return systemRequire(originalId);
                } else {
                    throw new Error('No module with ID: ' + id);
                }
            }
        } else {
            //There is a plugin in play.
            prefix = id.substring(0, index);
            id = id.substring(index + 1, id.length);

            plugin = stringRequire(systemRequire, exports, module, prefix, relId);

            if (plugin.normalize) {
                id = plugin.normalize(id, makeNormalize(relId));
            } else {
                //Normalize the ID normally.
                id = normalize(id, relId);
            }

            if (loaderCache[id]) {
                return loaderCache[id];
            } else {
                plugin.load(id, makeRequire(systemRequire, exports, module, relId), makeLoad(id), {});

                return loaderCache[id];
            }
        }
    };

    //Create a define function specific to the module asking for amdefine.
    function define(id, deps, factory) {
        if (Array.isArray(id)) {
            factory = deps;
            deps = id;
            id = undefined;
        } else if (typeof id !== 'string') {
            factory = id;
            id = deps = undefined;
        }

        if (deps && !Array.isArray(deps)) {
            factory = deps;
            deps = undefined;
        }

        if (!deps) {
            deps = ['require', 'exports', 'module'];
        }

        //Set up properties for this module. If an ID, then use
        //internal cache. If no ID, then use the external variables
        //for this node module.
        if (id) {
            //Put the module in deep freeze until there is a
            //require call for it.
            defineCache[id] = [id, deps, factory];
        } else {
            runFactory(id, deps, factory);
        }
    }

    //define.require, which has access to all the values in the
    //cache. Useful for AMD modules that all have IDs in the file,
    //but need to finally export a value to node based on one of those
    //IDs.
    define.require = function (id) {
        if (loaderCache[id]) {
            return loaderCache[id];
        }

        if (defineCache[id]) {
            runFactory.apply(null, defineCache[id]);
            return loaderCache[id];
        }
    };

    define.amd = {};

    return define;
}

module.exports = amdefine;

}).call(this,_dereq_("FWaASH"),"/../node_modules/rework-inline/node_modules/css/node_modules/css-stringify/node_modules/source-map/node_modules/amdefine/amdefine.js")
},{"FWaASH":61,"path":60}],97:[function(_dereq_,module,exports){
(function (process){
'use strict';

var fs = _dereq_('fs');
var path = _dereq_('path');

/**
 * Search for a file in an array of paths
 *
 * Options:
 *
 *   - `path` Paths to search in
 *   - `exclude` Paths to exclude
 *   - `global` Whether to search in `PATH`
 *
 * @param {String} name
 * @param {Object} opts
 * @api public
 */

module.exports = function (name, opts) {
    var file;

    opts = opts || {};
    opts.path = Array.isArray(opts.path) ? opts.path : [opts.path];
    opts.global = opts.global !== false;

    if (opts.global) {
        opts.path = opts.path.concat(process.env.PATH.split(path.delimiter));
    }

    if (opts.exclude) {
        opts.exclude = Array.isArray(opts.exclude) ? opts.exclude : [opts.exclude];
    }

    file = opts.path.map(function (dir) {
        if (dir && opts.exclude) {
            if (dir.indexOf(opts.exclude) === -1) {
                return path.join(dir, name);
            }
        } else if (dir) {
            return path.join(dir, name);
        }
    }).filter(fs.existsSync);

    if (!file.length) {
        return null;
    }

    return file;
};

}).call(this,_dereq_("FWaASH"))
},{"FWaASH":61,"fs":56,"path":60}],98:[function(_dereq_,module,exports){
'use strict';

/**
 * Trim string
 *
 * @param {String} str
 * @api private
 */

function trim(str) {
    str = str
        .replace(/^url\s?\(/, '')
        .replace(/\)$/, '')
        .trim()
        .replace(/^("|\')/, '')
        .replace(/("|\')$/, '');

    return str;
}

/**
 * Get @import statements from a string
 *
 * @param {String} str
 * @api public
 */

module.exports = function (str) {
    var regex = /(?:url\s?\((?:[^)]+)\))|(\'|")(?:.*)\1/gi;
    var ret = {};

    if (!str.match(regex)) {
        throw new Error('Could not find a valid import path in string: ' + str);
    }

    ret.path = trim(str.match(regex).toString());
    ret.condition = str.replace(/(^|\s)@import(\s|$)/gi, '').replace(regex, '').replace(' ', '');
    ret.rule = str;

    return ret;
};

},{}],99:[function(_dereq_,module,exports){
/**
 * Module dependencies.
 */

var visit = _dereq_('rework-visit');

/**
 * Constants.
 */

var VAR_SET_IDENTIFIER = '--';
var VAR_GET_IDENTIFIER = 'var(';

/**
 * Module export.
 */

module.exports = function(jsmap) {

  return function vars(style){
    var map = jsmap || {};

    // define variables
    style.rules.forEach(function (rule) {
      var varNameIndices = [];

      if (rule.type !== 'rule') return;

      // only variables declared for `:root` are supported
      if (rule.selectors.length === 1 && rule.selectors[0] === ':root') {
        rule.declarations.forEach(function(decl, idx){
          var prop = decl.property;
          var val = decl.value;

          if (prop && prop.indexOf(VAR_SET_IDENTIFIER) === 0) {
            map[prop] = val;
            varNameIndices.push(idx);
          }
        });

        // remove `--*` properties from the rule
        for (var i = varNameIndices.length - 1; i >= 0; i -= 1) {
          rule.declarations.splice(varNameIndices[i], 1);
        }
      }
    });

    // resolve variables
    visit(style, function(declarations, node){
      declarations.forEach(function(decl, idx){
        if (decl.value && decl.value.indexOf(VAR_GET_IDENTIFIER) !== -1) {
          decl.value = replaceValue(decl.value, map);
        }
      });
    });
  };
};

/**
 * Resolve CSS variables in a value
 *
 * The second argument to a CSS variable function, if provided, is a fallback
 * value, which is used as the substitution value when the referenced variable
 * is invalid.
 *
 * var(name[, fallback])
 *
 * Since the fallback can be *any* value, the value needs to be parsed
 * character-by-character to deduce the contents of a variable function.
 *
 * @param {String} value A property value known to contain CSS variable functions
 * @param {Object} map A map of variable names and values
 * @return {String} A property value with all CSS variables substituted.
 */

function replaceValue(value, map){
  // matches `var(name[, fallback])`, captures 'name' and 'fallback'
  var RE_VAR = /\bvar\(([\w-]+)(?:\s*,\s*)?(.*)?\)/;
  // matches `var()`
  var RE_EMPTY_VAR = /\bvar\(\s*\)/;

  var valueLen = value.length;
  var beginSlice = value.indexOf('var(');
  var endSlice = beginSlice + 'var('.length;
  var depth = 1;
  var currentChar;
  var cssVariable;

  // find the closing `)` of the CSS variable function,
  // accounting for nested functions
  while (endSlice < valueLen && depth > 0) {
    currentChar = value.charAt(endSlice);
    if (currentChar == '(') depth += 1;
    if (currentChar == ')') depth -= 1;
    endSlice += 1;
  }

  if (depth > 0) throw new Error('rework-vars: missing closing ")" in the value "' + value + '"');

  cssVariable = value.slice(beginSlice, endSlice);

  if (RE_EMPTY_VAR.test(cssVariable)) throw new Error('rework-vars: var() must contain a non-whitespace string');

  cssReplacement = cssVariable.replace(RE_VAR, function(_, name, fallback){
    var replacement = map[name];
    if (!replacement && !fallback) throw new Error('rework-vars: variable "' + name + '" is undefined');
    if (!replacement && fallback) return fallback;
    return replacement;
  });

  // resolve the variable
  value = value.split(cssVariable).join(cssReplacement);

  // recursively resolve any remaining variables
  if (value.indexOf(VAR_GET_IDENTIFIER) !== -1) {
    value = replaceValue(value, map);
  }

  return value;
}

},{"rework-visit":100}],100:[function(_dereq_,module,exports){

/**
 * Expose `visit()`.
 */

module.exports = visit;

/**
 * Visit `node`'s declarations recursively and
 * invoke `fn(declarations, node)`.
 *
 * @param {Object} node
 * @param {Function} fn
 * @api private
 */

function visit(node, fn){
  node.rules.forEach(function(rule){
    // @media etc
    if (rule.rules) {
      visit(rule, fn);
      return;
    }

    // keyframes
    if (rule.keyframes) {
      rule.keyframes.forEach(function(keyframe){
        fn(keyframe.declarations, rule);
      });
      return;
    }

    // @charset, @import etc
    if (!rule.declarations) return;

    fn(rule.declarations, node);
  });
};

},{}],101:[function(_dereq_,module,exports){

module.exports = _dereq_('./lib/rework');
},{"./lib/rework":111}],102:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var utils = _dereq_('../utils');
var path = _dereq_('path');
var stripQuotes = utils.stripQuotes;

/**
 * Vendor crap.
 */

var query = [
  '(min--moz-device-pixel-ratio: 1.5)',
  '(-o-min-device-pixel-ratio: 3/2)',
  '(-webkit-min-device-pixel-ratio: 1.5)',
  '(min-device-pixel-ratio: 1.5)',
  '(min-resolution: 144dpi)',
  '(min-resolution: 1.5dppx)'
].join(', ');

/**
 * Translate
 *
 *   .logo {
 *     background-image: url('/public/images/logo.png')
 *   }
 *
 * yields:
 *
 *   .logo {
 *     background-image: url('/public/images/logo.png')
 *   }
 *
 *   @media all and (-webkit-min-device-pixel-ratio : 1.5) {
 *     .logo {
 *       background-image: url("/public/images/logo@2x.png");
 *       background-size: contain
 *     }
 *   }
 *
 */

module.exports = function() {
  return function(style){
    style.rules.forEach(function(rule){
      if (!rule.declarations) return;

      var backgroundSize = rule.declarations.filter(backgroundWithSize).map(value)[0] || 'contain';

      rule.declarations.filter(backgroundWithHiResURL).forEach(function(decl){
        if ('comment' == decl.type) return;

        // parse url
        var val = decl.value.replace(/\s+(at-2x)\s*(;|$)/, '$2');
        decl.value = val;
        var i = val.indexOf('url(');
        var url = stripQuotes(val.slice(i + 4, val.indexOf(')', i)));
        var ext = path.extname(url);

        // ignore .svg
        if ('.svg' == ext) return;

        // @2x value
        url = path.join(path.dirname(url), path.basename(url, ext) + '@2x' + ext);

        // wrap in @media
        style.rules.push({
          type: 'media',
          media: query,
          rules: [
            {
              type: 'rule',
              selectors: rule.selectors,
              declarations: [
                {
                  type: 'declaration',
                  property: 'background-image',
                  value: 'url("' + url + '")'
                },
                {
                  type: 'declaration',
                  property: 'background-size',
                  value: backgroundSize
                }
              ]
            }
          ]
        });
      });
    });
  };
};

/**
 * Filter background[-image] with url().
 */

function backgroundWithHiResURL(decl) {
  return ('background' == decl.property
    || 'background-image' == decl.property)
    && ~decl.value.indexOf('url(')
    && ~decl.value.indexOf('at-2x');
}

/**
 * Predicate on background-size property.
 */

function backgroundWithSize(decl) {
  return 'background-size' == decl.property;
}

/**
 * Return value atribute of a declaration.
 */

function value(decl) {
  return decl.value;
}

},{"../utils":112,"path":60}],103:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var parse = _dereq_('color-parser');
var hsb2rgb = _dereq_('hsb2rgb');
var functions = _dereq_('./function');

/**
 * Provide color manipulation helpers.
 */

module.exports = function() {
  return functions({

    /**
     * Converts RGBA(color, alpha) to the corrosponding RGBA(r, g, b, a) equivalent.
     *
     *    background: rgba(#eee, .5)
     *    background: rgba(white, .2)
     *
     */

    rgba: function(color, alpha){
      var args;
      if (2 == arguments.length) {
        var c = parse(color.trim());
        args = [c.r, c.g, c.b, alpha];
      } else {
        args = [].slice.call(arguments);
      }

      return 'rgba(' + args.join(', ') + ')';
    },

    /**
     * Converts HSV (HSB) color values to RGB.
     * Saturation and brightness can be expressed as floats or percentages.
     *
     *     color: hsb(220, 45%, .3);
     *     color: hsb(220deg, 0.45, 30%);
     *
     */

    hsb: function (hue, saturation, value) {
      var rgb = hsb2rgb(hue, saturation, value);
      return 'rgb(' + rgb.join(', ') + ')';
    },


    /**
     * Converts HSV (HSB) color values with alpha specified to RGBa.
     * Saturation, brightness and alpha can be expressed as floats or
     * percentages.
     *
     *     color: hsba(220, 45%, .3, .4);
     *     color: hsba(220deg, 0.45, 30%, 40%);
     *
     */

    hsba: function (hue, saturation, value, alpha) {
      alpha = /%/.test(alpha)
        ? parseInt(alpha, 10) / 100
        : parseFloat(alpha, 10);

      alpha = String(alpha).replace(/^0+\./, '.');

      var rgb = hsb2rgb(hue, saturation, value);
      return 'rgba(' + rgb.join(', ') + ', ' + alpha + ')';
    }
  });
};

},{"./function":105,"color-parser":115,"hsb2rgb":137}],104:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var visit = _dereq_('../visit');

/**
 * Easing functions.
 */

var ease = {
  'ease-in-out-back': 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
  'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.150, 0.860)',
  'ease-in-out-expo': 'cubic-bezier(1.000, 0.000, 0.000, 1.000)',
  'ease-in-out-sine': 'cubic-bezier(0.445, 0.050, 0.550, 0.950)',
  'ease-in-out-quint': 'cubic-bezier(0.860, 0.000, 0.070, 1.000)',
  'ease-in-out-quart': 'cubic-bezier(0.770, 0.000, 0.175, 1.000)',
  'ease-in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1.000)',
  'ease-in-out-quad': 'cubic-bezier(0.455, 0.030, 0.515, 0.955)',
  'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.320, 1.275)',
  'ease-out-circ': 'cubic-bezier(0.075, 0.820, 0.165, 1.000)',
  'ease-out-expo': 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
  'ease-out-sine': 'cubic-bezier(0.390, 0.575, 0.565, 1.000)',
  'ease-out-quint': 'cubic-bezier(0.230, 1.000, 0.320, 1.000)',
  'ease-out-quart': 'cubic-bezier(0.165, 0.840, 0.440, 1.000)',
  'ease-out-cubic': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
  'ease-out-quad': 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
  'ease-in-back': 'cubic-bezier(0.600, -0.280, 0.735, 0.045)',
  'ease-in-circ': 'cubic-bezier(0.600, 0.040, 0.980, 0.335)',
  'ease-in-expo': 'cubic-bezier(0.950, 0.050, 0.795, 0.035)',
  'ease-in-sine': 'cubic-bezier(0.470, 0.000, 0.745, 0.715)',
  'ease-in-quint': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)',
  'ease-in-quart': 'cubic-bezier(0.895, 0.030, 0.685, 0.220)',
  'ease-in-cubic': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)',
  'ease-in-quad': 'cubic-bezier(0.550, 0.085, 0.680, 0.530)'
};

/**
 * Keys.
 */

var keys = Object.keys(ease);

/**
 * Provide additional easing functions:
 *
 *    #logo {
 *      transition: all 500ms ease-out-back;
 *    }
 *
 * yields:
 *
 *    #logo {
 *      transition: all 500ms cubic-bezier(0.175, 0.885, 0.320, 1.275)
 *    }
 *
 */

module.exports = function() {
  return function(style){
    visit.declarations(style, substitute);
  }
};

/**
 * Substitute easing functions.
 *
 * @api private
 */

function substitute(declarations) {
  for (var i = 0, len = declarations.length; i < len; ++i) {
    var decl = declarations[i];
    if ('comment' == decl.type) continue;
    if (!decl.property.match(/transition|animation|timing/)) continue;
    for (var k = 0; k < keys.length; ++k) {
      var key = keys[k];
      if (~decl.value.indexOf(key)) {
        decl.value = decl.value.replace(key, ease[key]);
        break;
      }
    }
  }
}

},{"../visit":113}],105:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var visit = _dereq_('../visit');
var utils = _dereq_('../utils');
var strip = utils.stripQuotes;

/**
 * Define custom function.
 */

module.exports = function(functions, args) {
  if (!functions) throw new Error('functions object required');
  return function(style){
    var functionMatcher = functionMatcherBuilder(Object.keys(functions).join('|'));

    visit.declarations(style, function(declarations){
      func(declarations, functions, functionMatcher, args);
    });
  }
};

/**
 * Visit declarations and apply functions.
 *
 * @param {Array} declarations
 * @param {Object} functions
 * @param {RegExp} functionMatcher
 * @param {Boolean} [parseArgs]
 * @api private
 */

function func(declarations, functions, functionMatcher, parseArgs) {
  if (false !== parseArgs) parseArgs = true;

  declarations.forEach(function(decl){
    if ('comment' == decl.type) return;
    var generatedFuncs = [], result, generatedFunc;

    while (decl.value.match(functionMatcher)) {
      decl.value = decl.value.replace(functionMatcher, function(_, name, args){
        if (parseArgs) {
          args = args.split(/\s*,\s*/).map(strip);
        } else {
          args = [strip(args)];
        }
        // Ensure result is string
        result = '' + functions[name].apply(decl, args);

        // Prevent fall into infinite loop like this:
        //
        // {
        //   url: function(path) {
        //     return 'url(' + '/some/prefix' + path + ')'
        //   }
        // }
        //
        generatedFunc = {from: name, to: name + getRandomString()};
        result = result.replace(functionMatcherBuilder(name), generatedFunc.to + '($2)');
        generatedFuncs.push(generatedFunc);
        return result;
      });
    }

    generatedFuncs.forEach(function(func) {
      decl.value = decl.value.replace(func.to, func.from);
    })
  });
}

/**
 * Build function regexp
 *
 * @param {String} name
 * @api private
 */

function functionMatcherBuilder(name) {
  // /(?!\W+)(\w+)\(([^()]+)\)/
  return new RegExp("(?!\\W+)(" + name + ")\\(([^\(\)]+)\\)");
}

/**
 * get random string
 *
 * @api private
 */

function getRandomString() {
  return Math.random().toString(36).slice(2);
}


},{"../utils":112,"../visit":113}],106:[function(_dereq_,module,exports){
(function (Buffer){

/**
 * Module dependencies.
 */

var func = _dereq_('./function');
var path = _dereq_('path');
var mime = _dereq_('mime');
var fs = _dereq_('fs');
var read = fs.readFileSync;
var exists = fs.existsSync;

/**
 * Inline images and fonts.
 *
 *    .logo {
 *      background: inline(icons/logo.png);
 *    }
 *
 * yields:
 *
 *    .logo {
 *      background: url("data:image/png;base64,iVBORw0…");
 *    }
 *
 */

module.exports = function(dirs) {
  if (!Array.isArray(dirs)) {
    dirs = Array.prototype.slice.call(arguments);
  }

  function inline(filename){
    var file = dirs.map(function(dir) {
      return path.join(dir, filename);
    }).filter(exists)[0];

    if (!file) throw new Error('inline(): failed to find "' + filename + '"');

    var type = mime.lookup(file);
    var base64 = new Buffer(read(file)).toString('base64');
    return 'url("data:' + type + ';base64,' + base64 + '")';
  }

  return func({ inline: inline });
};

}).call(this,_dereq_("buffer").Buffer)
},{"./function":105,"buffer":57,"fs":56,"mime":138,"path":60}],107:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var visit = _dereq_('../visit');

/**
 * Define custom mixins.
 */

module.exports = function(mixins) {
  if (!mixins) throw new Error('mixins object required');
  return function(style, rework){
    visit.declarations(style, function(declarations){
      mixin(rework, declarations, mixins);
    });
  }
};

/**
 * Visit declarations and apply mixins.
 *
 * @param {Rework} rework
 * @param {Array} declarations
 * @param {Object} mixins
 * @api private
 */

function mixin(rework, declarations, mixins) {
  for (var i = 0; i < declarations.length; ++i) {
    var decl = declarations[i];
    if ('comment' == decl.type) continue;

    var key = decl.property;
    var val = decl.value;
    var fn = mixins[key];
    if (!fn) continue;

    // invoke mixin
    var ret = fn.call(rework, val);

    // apply properties
    for (var key in ret) {
      var val = ret[key];
      if (Array.isArray(val)) {
        val.forEach(function(val){
          declarations.splice(i++, 0, {
            type: 'declaration',
            property: key,
            value: val
          });
        });
      } else {
        declarations.splice(i++, 0, {
          type: 'declaration',
          property: key,
          value: val
        });
      }
    }

    // remove original
    declarations.splice(i--, 1);
  }
}

},{"../visit":113}],108:[function(_dereq_,module,exports){

/**
 * Prefix selectors with `str`.
 *
 *    button {
 *      color: red;
 *    }
 *
 * yields:
 *
 *    #dialog button {
 *      color: red;
 *    }
 *
 */

module.exports = function(str) {
  return function(style){
    style.rules = style.rules.map(function(rule){
      if (!rule.selectors) return rule;
      rule.selectors = rule.selectors.map(function(selector){
        if (':root' == selector) return str;
        selector = selector.replace(/^\:root\s?/, '');
        return str + ' ' + selector;
      });
      return rule;
    });
  }
};

},{}],109:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var visit = _dereq_('../visit');

/**
 * Provide property reference support.
 *
 *    button {
 *      width: 50px;
 *      height: @width;
 *      line-height: @height;
 *    }
 *
 * yields:
 *
 *    button {
 *      width: 50px;
*       height: 50px;
*       line-height: 50px;
 *    }
 *
 */

module.exports = function() {
  return function(style){
    visit.declarations(style, substitute);
  }
};

/**
 * Substitute easing functions.
 *
 * @api private
 */

function substitute(declarations) {
  var map = {};

  for (var i = 0, len = declarations.length; i < len; ++i) {
    var decl = declarations[i];
    var key = decl.property;
    var val = decl.value;

    if ('comment' == decl.type) continue;

    decl.value = val.replace(/@([-\w]+)/g, function(_, name){
      // TODO: fix this problem for real with visionmedia/css-value
      if ('2x' == name) return '@' + name;
      if (null == map[name]) throw new Error('@' + name + ' is not defined in this scope');
      return map[name];
    });

    map[key] = decl.value;
  }
}

},{"../visit":113}],110:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var func = _dereq_('./function');

/**
 * Map `url()` calls.
 *
 *   body {
 *     background: url(/images/bg.png);
 *   }
 *
 * yields:
 *
 *   body {
 *     background: url(http://example.com/images/bg.png);
 *   }
 *
 */

module.exports = function(fn) {
  return func({
    url: function(path){
      return 'url("' + fn(path) + '")';
    }
  }, false);
};

},{"./function":105}],111:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var css = _dereq_('css');

/**
 * Expose `rework`.
 */

exports = module.exports = rework;

/**
 * Expose `visit` helpers.
 */

exports.visit = _dereq_('./visit');

/**
 * Expose prefix properties.
 */

exports.__defineGetter__('properties', function () {
  console.warn('rework.properties has been removed.');
  return [];
})

/**
 * Initialize a new stylesheet `Rework` with `str`.
 *
 * @param {String} str
 * @param {Object} options
 * @return {Rework}
 * @api public
 */

function rework(str, options) {
  options = options || {};
  options.position = true; // we need this for sourcemaps
  return new Rework(css.parse(str, options));
}

/**
 * Initialize a new stylesheet `Rework` with `obj`.
 *
 * @param {Object} obj
 * @api private
 */

function Rework(obj) {
  this.obj = obj;
}

/**
 * Use the given plugin `fn(style, rework)`.
 *
 * @param {Function} fn
 * @return {Rework}
 * @api public
 */

Rework.prototype.use = function(fn){
  fn(this.obj.stylesheet, this);
  return this;
};

/**
 * Specify global vendor `prefixes`,
 * explicit ones may still be passed
 * to most plugins.
 *
 * Deprecated as of https://github.com/visionmedia/rework/issues/126.
 *
 * @param {Array} prefixes
 * @return {Rework}
 * @api public
 */

Rework.prototype.vendors = function(prefixes){
  console.warn('rework.vendors() is deprecated. Please see: https://github.com/visionmedia/rework/issues/126.');
  this.prefixes = prefixes;
  return this;
};

/**
 * Stringify the stylesheet.
 *
 * @param {Object} options
 * @return {String}
 * @api public
 */

Rework.prototype.toString = function(options){
  options = options || {};
  var result = css.stringify(this.obj, options);
  if (options.sourcemap && !options.sourcemapAsObject) {
    result = result.code + '\n' + sourcemapToComment(result.map);
  }
  return result;
};

/**
 * Convert sourcemap to base64-encoded comment
 *
 * @param {Object} map
 * @return {String}
 * @api private
 */

function sourcemapToComment(map) {
  var convertSourceMap = _dereq_('convert-source-map');
  var content = convertSourceMap.fromObject(map).toBase64();
  return '/*# sourceMappingURL=data:application/json;base64,' + content + ' */';
}

/**
 * Expose plugins.
 */

exports.mixin = exports.mixins = _dereq_('./plugins/mixin');
exports.function = exports.functions = _dereq_('./plugins/function');
exports.colors = _dereq_('./plugins/colors');
exports.extend = _dereq_('rework-inherit');
exports.references = _dereq_('./plugins/references');
exports.prefixSelectors = _dereq_('./plugins/prefix-selectors');
exports.at2x = _dereq_('./plugins/at2x');
exports.url = _dereq_('./plugins/url');
exports.ease = _dereq_('./plugins/ease');

/**
 * Warn if users try to use removed components.
 * This will be removed in v1.
 */

[
  'vars',
  'keyframes',
  'prefix',
  'prefixValue',
].forEach(function (plugin) {
  exports[plugin] = function () {
    console.warn('rework.' + plugin + '() has been removed from rework core. Please view https://github.com/visionmedia/rework or https://github.com/visionmedia/rework/wiki/Plugins-and-Utilities.');
    return noop;
  };
});

/**
 * Try/catch plugins unavailable in component.
 */

 try {
  exports.inline = _dereq_('./plugins/inline');
} catch (err) {}

function noop(){}

},{"./plugins/at2x":102,"./plugins/colors":103,"./plugins/ease":104,"./plugins/function":105,"./plugins/inline":106,"./plugins/mixin":107,"./plugins/prefix-selectors":108,"./plugins/references":109,"./plugins/url":110,"./visit":113,"convert-source-map":116,"css":117,"rework-inherit":139}],112:[function(_dereq_,module,exports){

/**
 * Strip `str` quotes.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.stripQuotes = function(str) {
  if ('"' == str[0] || "'" == str[0]) return str.slice(1, -1);
  return str;
};
},{}],113:[function(_dereq_,module,exports){

// TODO: require() directly in plugins...
exports.declarations = _dereq_('rework-visit');

},{"rework-visit":140}],114:[function(_dereq_,module,exports){

module.exports = {
    aliceblue: [240, 248, 255]
  , antiquewhite: [250, 235, 215]
  , aqua: [0, 255, 255]
  , aquamarine: [127, 255, 212]
  , azure: [240, 255, 255]
  , beige: [245, 245, 220]
  , bisque: [255, 228, 196]
  , black: [0, 0, 0]
  , blanchedalmond: [255, 235, 205]
  , blue: [0, 0, 255]
  , blueviolet: [138, 43, 226]
  , brown: [165, 42, 42]
  , burlywood: [222, 184, 135]
  , cadetblue: [95, 158, 160]
  , chartreuse: [127, 255, 0]
  , chocolate: [210, 105, 30]
  , coral: [255, 127, 80]
  , cornflowerblue: [100, 149, 237]
  , cornsilk: [255, 248, 220]
  , crimson: [220, 20, 60]
  , cyan: [0, 255, 255]
  , darkblue: [0, 0, 139]
  , darkcyan: [0, 139, 139]
  , darkgoldenrod: [184, 132, 11]
  , darkgray: [169, 169, 169]
  , darkgreen: [0, 100, 0]
  , darkgrey: [169, 169, 169]
  , darkkhaki: [189, 183, 107]
  , darkmagenta: [139, 0, 139]
  , darkolivegreen: [85, 107, 47]
  , darkorange: [255, 140, 0]
  , darkorchid: [153, 50, 204]
  , darkred: [139, 0, 0]
  , darksalmon: [233, 150, 122]
  , darkseagreen: [143, 188, 143]
  , darkslateblue: [72, 61, 139]
  , darkslategray: [47, 79, 79]
  , darkslategrey: [47, 79, 79]
  , darkturquoise: [0, 206, 209]
  , darkviolet: [148, 0, 211]
  , deeppink: [255, 20, 147]
  , deepskyblue: [0, 191, 255]
  , dimgray: [105, 105, 105]
  , dimgrey: [105, 105, 105]
  , dodgerblue: [30, 144, 255]
  , firebrick: [178, 34, 34]
  , floralwhite: [255, 255, 240]
  , forestgreen: [34, 139, 34]
  , fuchsia: [255, 0, 255]
  , gainsboro: [220, 220, 220]
  , ghostwhite: [248, 248, 255]
  , gold: [255, 215, 0]
  , goldenrod: [218, 165, 32]
  , gray: [128, 128, 128]
  , green: [0, 128, 0]
  , greenyellow: [173, 255, 47]
  , grey: [128, 128, 128]
  , honeydew: [240, 255, 240]
  , hotpink: [255, 105, 180]
  , indianred: [205, 92, 92]
  , indigo: [75, 0, 130]
  , ivory: [255, 255, 240]
  , khaki: [240, 230, 140]
  , lavender: [230, 230, 250]
  , lavenderblush: [255, 240, 245]
  , lawngreen: [124, 252, 0]
  , lemonchiffon: [255, 250, 205]
  , lightblue: [173, 216, 230]
  , lightcoral: [240, 128, 128]
  , lightcyan: [224, 255, 255]
  , lightgoldenrodyellow: [250, 250, 210]
  , lightgray: [211, 211, 211]
  , lightgreen: [144, 238, 144]
  , lightgrey: [211, 211, 211]
  , lightpink: [255, 182, 193]
  , lightsalmon: [255, 160, 122]
  , lightseagreen: [32, 178, 170]
  , lightskyblue: [135, 206, 250]
  , lightslategray: [119, 136, 153]
  , lightslategrey: [119, 136, 153]
  , lightsteelblue: [176, 196, 222]
  , lightyellow: [255, 255, 224]
  , lime: [0, 255, 0]
  , limegreen: [50, 205, 50]
  , linen: [250, 240, 230]
  , magenta: [255, 0, 255]
  , maroon: [128, 0, 0]
  , mediumaquamarine: [102, 205, 170]
  , mediumblue: [0, 0, 205]
  , mediumorchid: [186, 85, 211]
  , mediumpurple: [147, 112, 219]
  , mediumseagreen: [60, 179, 113]
  , mediumslateblue: [123, 104, 238]
  , mediumspringgreen: [0, 250, 154]
  , mediumturquoise: [72, 209, 204]
  , mediumvioletred: [199, 21, 133]
  , midnightblue: [25, 25, 112]
  , mintcream: [245, 255, 250]
  , mistyrose: [255, 228, 225]
  , moccasin: [255, 228, 181]
  , navajowhite: [255, 222, 173]
  , navy: [0, 0, 128]
  , oldlace: [253, 245, 230]
  , olive: [128, 128, 0]
  , olivedrab: [107, 142, 35]
  , orange: [255, 165, 0]
  , orangered: [255, 69, 0]
  , orchid: [218, 112, 214]
  , palegoldenrod: [238, 232, 170]
  , palegreen: [152, 251, 152]
  , paleturquoise: [175, 238, 238]
  , palevioletred: [219, 112, 147]
  , papayawhip: [255, 239, 213]
  , peachpuff: [255, 218, 185]
  , peru: [205, 133, 63]
  , pink: [255, 192, 203]
  , plum: [221, 160, 203]
  , powderblue: [176, 224, 230]
  , purple: [128, 0, 128]
  , red: [255, 0, 0]
  , rosybrown: [188, 143, 143]
  , royalblue: [65, 105, 225]
  , saddlebrown: [139, 69, 19]
  , salmon: [250, 128, 114]
  , sandybrown: [244, 164, 96]
  , seagreen: [46, 139, 87]
  , seashell: [255, 245, 238]
  , sienna: [160, 82, 45]
  , silver: [192, 192, 192]
  , skyblue: [135, 206, 235]
  , slateblue: [106, 90, 205]
  , slategray: [119, 128, 144]
  , slategrey: [119, 128, 144]
  , snow: [255, 255, 250]
  , springgreen: [0, 255, 127]
  , steelblue: [70, 130, 180]
  , tan: [210, 180, 140]
  , teal: [0, 128, 128]
  , thistle: [216, 191, 216]
  , tomato: [255, 99, 71]
  , turquoise: [64, 224, 208]
  , violet: [238, 130, 238]
  , wheat: [245, 222, 179]
  , white: [255, 255, 255]
  , whitesmoke: [245, 245, 245]
  , yellow: [255, 255, 0]
  , yellowgreen: [154, 205, 5]
};
},{}],115:[function(_dereq_,module,exports){

/**
 * Module dependencies.
 */

var colors = _dereq_('./colors');

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Parse `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api public
 */

function parse(str) {
  return named(str)
    || hex3(str)
    || hex6(str)
    || rgb(str)
    || rgba(str);
}

/**
 * Parse named css color `str`.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function named(str) {
  var c = colors[str.toLowerCase()];
  if (!c) return;
  return {
    r: c[0],
    g: c[1],
    b: c[2]
  }
}

/**
 * Parse rgb(n, n, n)
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function rgb(str) {
  if (0 == str.indexOf('rgb(')) {
    str = str.match(/rgb\(([^)]+)\)/)[1];
    var parts = str.split(/ *, */).map(Number);
    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: 1
    }
  }
}

/**
 * Parse rgba(n, n, n, n)
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function rgba(str) {
  if (0 == str.indexOf('rgba(')) {
    str = str.match(/rgba\(([^)]+)\)/)[1];
    var parts = str.split(/ *, */).map(Number);
    return {
      r: parts[0],
      g: parts[1],
      b: parts[2],
      a: parts[3]
    }
  }
}

/**
 * Parse #nnnnnn
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function hex6(str) {
  if ('#' == str[0] && 7 == str.length) {
    return {
      r: parseInt(str.slice(1, 3), 16),
      g: parseInt(str.slice(3, 5), 16),
      b: parseInt(str.slice(5, 7), 16),
      a: 1
    }
  }
}

/**
 * Parse #nnn
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function hex3(str) {
  if ('#' == str[0] && 4 == str.length) {
    return {
      r: parseInt(str[1] + str[1], 16),
      g: parseInt(str[2] + str[2], 16),
      b: parseInt(str[3] + str[3], 16),
      a: 1
    }
  }
}


},{"./colors":114}],116:[function(_dereq_,module,exports){
(function (Buffer){
'use strict';
var fs = _dereq_('fs');
var path = _dereq_('path');

var commentRx = /^[ \t]*(?:\/\/|\/\*)[@#][ \t]+sourceMappingURL=data:(?:application|text)\/json;base64,(.+)(?:\*\/)?/mg;
var mapFileCommentRx =
  // //# sourceMappingURL=foo.js.map                       /*# sourceMappingURL=foo.js.map */
  /(?:^[ \t]*\/\/[@|#][ \t]+sourceMappingURL=(.+?)[ \t]*$)|(?:^[ \t]*\/\*[@#][ \t]+sourceMappingURL=(.+?)[ \t]*\*\/[ \t]*$)/mg

function decodeBase64(base64) {
  return new Buffer(base64, 'base64').toString();
}

function stripComment(sm) {
  return sm.split(',').pop();
}

function readFromFileMap(sm, dir) {
  // NOTE: this will only work on the server since it attempts to read the map file

  var r = mapFileCommentRx.exec(sm);
  mapFileCommentRx.lastIndex = 0;
  
  // for some odd reason //# .. captures in 1 and /* .. */ in 2
  var filename = r[1] || r[2];
  var filepath = path.join(dir, filename);

  try {
    return fs.readFileSync(filepath, 'utf8');
  } catch (e) {
    throw new Error('An error occurred while trying to read the map file at ' + filepath + '\n' + e);
  }
}

function Converter (sm, opts) {
  opts = opts || {};
  try {
    if (opts.isFileComment) sm = readFromFileMap(sm, opts.commentFileDir);
    if (opts.hasComment) sm = stripComment(sm);
    if (opts.isEncoded) sm = decodeBase64(sm);
    if (opts.isJSON || opts.isEncoded) sm = JSON.parse(sm);

    this.sourcemap = sm;
  } catch(e) {
    console.error(e);
    return null;
  }
}

Converter.prototype.toJSON = function (space) {
  return JSON.stringify(this.sourcemap, null, space);
};

Converter.prototype.toBase64 = function () {
  var json = this.toJSON();
  return new Buffer(json).toString('base64');
};

Converter.prototype.toComment = function () {
  var base64 = this.toBase64();
  return '//# sourceMappingURL=data:application/json;base64,' + base64;
};

// returns copy instead of original
Converter.prototype.toObject = function () {
  return JSON.parse(this.toJSON());
};

Converter.prototype.addProperty = function (key, value) {
  if (this.sourcemap.hasOwnProperty(key)) throw new Error('property %s already exists on the sourcemap, use set property instead');
  return this.setProperty(key, value);
};

Converter.prototype.setProperty = function (key, value) {
  this.sourcemap[key] = value;
  return this;
};

Converter.prototype.getProperty = function (key) {
  return this.sourcemap[key];
};

exports.fromObject = function (obj) {
  return new Converter(obj);
};

exports.fromJSON = function (json) {
  return new Converter(json, { isJSON: true });
};

exports.fromBase64 = function (base64) {
  return new Converter(base64, { isEncoded: true });
};

exports.fromComment = function (comment) {
  comment = comment
    .replace(/^\/\*/g, '//')
    .replace(/\*\/$/g, '');

  return new Converter(comment, { isEncoded: true, hasComment: true });
};

exports.fromMapFileComment = function (comment, dir) {
  return new Converter(comment, { commentFileDir: dir, isFileComment: true, isJSON: true });
};

// Finds last sourcemap comment in file or returns null if none was found
exports.fromSource = function (content) {
  var m = content.match(commentRx);
  commentRx.lastIndex = 0;
  return m ? exports.fromComment(m.pop()) : null;
};

// Finds last sourcemap comment in file or returns null if none was found
exports.fromMapFileSource = function (content, dir) {
  var m = content.match(mapFileCommentRx);
  mapFileCommentRx.lastIndex = 0;
  return m ? exports.fromMapFileComment(m.pop(), dir) : null;
};

exports.removeComments = function (src) {
  commentRx.lastIndex = 0;
  return src.replace(commentRx, '');
};

exports.removeMapFileComments = function (src) {
  mapFileCommentRx.lastIndex = 0;
  return src.replace(mapFileCommentRx, '');
};

exports.__defineGetter__('commentRegex', function () {
  commentRx.lastIndex = 0;
  return commentRx; 
});

exports.__defineGetter__('mapFileCommentRegex', function () {
  mapFileCommentRx.lastIndex = 0;
  return mapFileCommentRx; 
});

}).call(this,_dereq_("buffer").Buffer)
},{"buffer":57,"fs":56,"path":60}],117:[function(_dereq_,module,exports){
module.exports=_dereq_(80)
},{"css-parse":118,"css-stringify":119}],118:[function(_dereq_,module,exports){
module.exports=_dereq_(81)
},{}],119:[function(_dereq_,module,exports){
module.exports=_dereq_(41)
},{"./lib/compress":121,"./lib/identity":122,"./lib/source-map-support":123}],120:[function(_dereq_,module,exports){
module.exports=_dereq_(42)
},{}],121:[function(_dereq_,module,exports){
module.exports=_dereq_(43)
},{"./compiler":120}],122:[function(_dereq_,module,exports){
module.exports=_dereq_(44)
},{"./compiler":120}],123:[function(_dereq_,module,exports){
module.exports=_dereq_(45)
},{"source-map":124}],124:[function(_dereq_,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"./source-map/source-map-consumer":129,"./source-map/source-map-generator":130,"./source-map/source-node":131}],125:[function(_dereq_,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"./util":132,"amdefine":133}],126:[function(_dereq_,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"./base64":127,"amdefine":133}],127:[function(_dereq_,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"amdefine":133}],128:[function(_dereq_,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"amdefine":133}],129:[function(_dereq_,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"./array-set":125,"./base64-vlq":126,"./binary-search":128,"./util":132,"amdefine":133}],130:[function(_dereq_,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"./array-set":125,"./base64-vlq":126,"./util":132,"amdefine":133}],131:[function(_dereq_,module,exports){
arguments[4][53][0].apply(exports,arguments)
},{"./source-map-generator":130,"./util":132,"amdefine":133}],132:[function(_dereq_,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"amdefine":133}],133:[function(_dereq_,module,exports){
(function (process,__filename){
/** vim: et:ts=4:sw=4:sts=4
 * @license amdefine 0.1.0 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/amdefine for details
 */

/*jslint node: true */
/*global module, process */
'use strict';

/**
 * Creates a define for node.
 * @param {Object} module the "module" object that is defined by Node for the
 * current module.
 * @param {Function} [requireFn]. Node's require function for the current module.
 * It only needs to be passed in Node versions before 0.5, when module.require
 * did not exist.
 * @returns {Function} a define function that is usable for the current node
 * module.
 */
function amdefine(module, requireFn) {
    'use strict';
    var defineCache = {},
        loaderCache = {},
        alreadyCalled = false,
        path = _dereq_('path'),
        makeRequire, stringRequire;

    /**
     * Trims the . and .. from an array of path segments.
     * It will keep a leading path segment if a .. will become
     * the first path segment, to help with module name lookups,
     * which act like paths, but can be remapped. But the end result,
     * all paths that use this function should look normalized.
     * NOTE: this method MODIFIES the input array.
     * @param {Array} ary the array of path segments.
     */
    function trimDots(ary) {
        var i, part;
        for (i = 0; ary[i]; i+= 1) {
            part = ary[i];
            if (part === '.') {
                ary.splice(i, 1);
                i -= 1;
            } else if (part === '..') {
                if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                    //End of the line. Keep at least one non-dot
                    //path segment at the front so it can be mapped
                    //correctly to disk. Otherwise, there is likely
                    //no path mapping for a path starting with '..'.
                    //This can still fail, but catches the most reasonable
                    //uses of ..
                    break;
                } else if (i > 0) {
                    ary.splice(i - 1, 2);
                    i -= 2;
                }
            }
        }
    }

    function normalize(name, baseName) {
        var baseParts;

        //Adjust any relative paths.
        if (name && name.charAt(0) === '.') {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                baseParts = baseName.split('/');
                baseParts = baseParts.slice(0, baseParts.length - 1);
                baseParts = baseParts.concat(name.split('/'));
                trimDots(baseParts);
                name = baseParts.join('/');
            }
        }

        return name;
    }

    /**
     * Create the normalize() function passed to a loader plugin's
     * normalize method.
     */
    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(id) {
        function load(value) {
            loaderCache[id] = value;
        }

        load.fromText = function (id, text) {
            //This one is difficult because the text can/probably uses
            //define, and any relative paths and requires should be relative
            //to that id was it would be found on disk. But this would require
            //bootstrapping a module/require fairly deeply from node core.
            //Not sure how best to go about that yet.
            throw new Error('amdefine does not implement load.fromText');
        };

        return load;
    }

    makeRequire = function (systemRequire, exports, module, relId) {
        function amdRequire(deps, callback) {
            if (typeof deps === 'string') {
                //Synchronous, single module require('')
                return stringRequire(systemRequire, exports, module, deps, relId);
            } else {
                //Array of dependencies with a callback.

                //Convert the dependencies to modules.
                deps = deps.map(function (depName) {
                    return stringRequire(systemRequire, exports, module, depName, relId);
                });

                //Wait for next tick to call back the require call.
                process.nextTick(function () {
                    callback.apply(null, deps);
                });
            }
        }

        amdRequire.toUrl = function (filePath) {
            if (filePath.indexOf('.') === 0) {
                return normalize(filePath, path.dirname(module.filename));
            } else {
                return filePath;
            }
        };

        return amdRequire;
    };

    //Favor explicit value, passed in if the module wants to support Node 0.4.
    requireFn = requireFn || function req() {
        return module.require.apply(module, arguments);
    };

    function runFactory(id, deps, factory) {
        var r, e, m, result;

        if (id) {
            e = loaderCache[id] = {};
            m = {
                id: id,
                uri: __filename,
                exports: e
            };
            r = makeRequire(requireFn, e, m, id);
        } else {
            //Only support one define call per file
            if (alreadyCalled) {
                throw new Error('amdefine with no module ID cannot be called more than once per file.');
            }
            alreadyCalled = true;

            //Use the real variables from node
            //Use module.exports for exports, since
            //the exports in here is amdefine exports.
            e = module.exports;
            m = module;
            r = makeRequire(requireFn, e, m, module.id);
        }

        //If there are dependencies, they are strings, so need
        //to convert them to dependency values.
        if (deps) {
            deps = deps.map(function (depName) {
                return r(depName);
            });
        }

        //Call the factory with the right dependencies.
        if (typeof factory === 'function') {
            result = factory.apply(m.exports, deps);
        } else {
            result = factory;
        }

        if (result !== undefined) {
            m.exports = result;
            if (id) {
                loaderCache[id] = m.exports;
            }
        }
    }

    stringRequire = function (systemRequire, exports, module, id, relId) {
        //Split the ID by a ! so that
        var index = id.indexOf('!'),
            originalId = id,
            prefix, plugin;

        if (index === -1) {
            id = normalize(id, relId);

            //Straight module lookup. If it is one of the special dependencies,
            //deal with it, otherwise, delegate to node.
            if (id === 'require') {
                return makeRequire(systemRequire, exports, module, relId);
            } else if (id === 'exports') {
                return exports;
            } else if (id === 'module') {
                return module;
            } else if (loaderCache.hasOwnProperty(id)) {
                return loaderCache[id];
            } else if (defineCache[id]) {
                runFactory.apply(null, defineCache[id]);
                return loaderCache[id];
            } else {
                if(systemRequire) {
                    return systemRequire(originalId);
                } else {
                    throw new Error('No module with ID: ' + id);
                }
            }
        } else {
            //There is a plugin in play.
            prefix = id.substring(0, index);
            id = id.substring(index + 1, id.length);

            plugin = stringRequire(systemRequire, exports, module, prefix, relId);

            if (plugin.normalize) {
                id = plugin.normalize(id, makeNormalize(relId));
            } else {
                //Normalize the ID normally.
                id = normalize(id, relId);
            }

            if (loaderCache[id]) {
                return loaderCache[id];
            } else {
                plugin.load(id, makeRequire(systemRequire, exports, module, relId), makeLoad(id), {});

                return loaderCache[id];
            }
        }
    };

    //Create a define function specific to the module asking for amdefine.
    function define(id, deps, factory) {
        if (Array.isArray(id)) {
            factory = deps;
            deps = id;
            id = undefined;
        } else if (typeof id !== 'string') {
            factory = id;
            id = deps = undefined;
        }

        if (deps && !Array.isArray(deps)) {
            factory = deps;
            deps = undefined;
        }

        if (!deps) {
            deps = ['require', 'exports', 'module'];
        }

        //Set up properties for this module. If an ID, then use
        //internal cache. If no ID, then use the external variables
        //for this node module.
        if (id) {
            //Put the module in deep freeze until there is a
            //require call for it.
            defineCache[id] = [id, deps, factory];
        } else {
            runFactory(id, deps, factory);
        }
    }

    //define.require, which has access to all the values in the
    //cache. Useful for AMD modules that all have IDs in the file,
    //but need to finally export a value to node based on one of those
    //IDs.
    define.require = function (id) {
        if (loaderCache[id]) {
            return loaderCache[id];
        }

        if (defineCache[id]) {
            runFactory.apply(null, defineCache[id]);
            return loaderCache[id];
        }
    };

    define.amd = {};

    return define;
}

module.exports = amdefine;

}).call(this,_dereq_("FWaASH"),"/../node_modules/rework/node_modules/css/node_modules/css-stringify/node_modules/source-map/node_modules/amdefine/amdefine.js")
},{"FWaASH":61,"path":60}],134:[function(_dereq_,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = _dereq_('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors and the Firebug
 * extension (*not* the built-in Firefox web inpector) are
 * known to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table)));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? '%c ' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, ''].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // This hackery is required for IE8,
  // where the `console.log` function doesn't have 'apply'
  return 'object' == typeof console
    && 'function' == typeof console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      localStorage.removeItem('debug');
    } else {
      localStorage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = localStorage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

},{"./debug":135}],135:[function(_dereq_,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = _dereq_('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = exports.log || enabled.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":136}],136:[function(_dereq_,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 's':
      return n * s;
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],137:[function(_dereq_,module,exports){

function hsb2rgb(hue, saturation, value) {
  hue = (parseInt(hue, 10) || 0) % 360;

  saturation = /%/.test(saturation)
    ? parseInt(saturation, 10) / 100
    : parseFloat(saturation, 10);

  value = /%/.test(value)
    ? parseInt(value, 10) / 100
    : parseFloat(value, 10);

  saturation = Math.max(0, Math.min(saturation, 1));
  value = Math.max(0, Math.min(value, 1));

  var rgb;
  if (saturation === 0) {
    return [
      Math.round(255 * value),
      Math.round(255 * value),
      Math.round(255 * value)
    ];
  }

  var side = hue / 60;
  var chroma = value * saturation;
  var x = chroma * (1 - Math.abs(side % 2 - 1));
  var match = value - chroma;

  switch (Math.floor(side)) {
  case 0: rgb = [ chroma, x, 0 ]; break;
  case 1: rgb = [ x, chroma, 0 ]; break;
  case 2: rgb = [ 0, chroma, x ]; break;
  case 3: rgb = [ 0, x, chroma ]; break;
  case 4: rgb = [ x, 0, chroma ]; break;
  case 5: rgb = [ chroma, 0, x ]; break;
  default: rgb = [ 0, 0, 0 ];
  }

  rgb[0] = Math.round(255 * (rgb[0] + match));
  rgb[1] = Math.round(255 * (rgb[1] + match));
  rgb[2] = Math.round(255 * (rgb[2] + match));

  return rgb;
}


module.exports = hsb2rgb;

},{}],138:[function(_dereq_,module,exports){
(function (process,__dirname){
var path = _dereq_('path');
var fs = _dereq_('fs');

function Mime() {
  // Map of extension -> mime type
  this.types = Object.create(null);

  // Map of mime type -> extension
  this.extensions = Object.create(null);
}

/**
 * Define mimetype -> extension mappings.  Each key is a mime-type that maps
 * to an array of extensions associated with the type.  The first extension is
 * used as the default extension for the type.
 *
 * e.g. mime.define({'audio/ogg', ['oga', 'ogg', 'spx']});
 *
 * @param map (Object) type definitions
 */
Mime.prototype.define = function (map) {
  for (var type in map) {
    var exts = map[type];

    for (var i = 0; i < exts.length; i++) {
      if (process.env.DEBUG_MIME && this.types[exts]) {
        console.warn(this._loading.replace(/.*\//, ''), 'changes "' + exts[i] + '" extension type from ' +
          this.types[exts] + ' to ' + type);
      }

      this.types[exts[i]] = type;
    }

    // Default extension is the first one we encounter
    if (!this.extensions[type]) {
      this.extensions[type] = exts[0];
    }
  }
};

/**
 * Load an Apache2-style ".types" file
 *
 * This may be called multiple times (it's expected).  Where files declare
 * overlapping types/extensions, the last file wins.
 *
 * @param file (String) path of file to load.
 */
Mime.prototype.load = function(file) {

  this._loading = file;
  // Read file and split into lines
  var map = {},
      content = fs.readFileSync(file, 'ascii'),
      lines = content.split(/[\r\n]+/);

  lines.forEach(function(line) {
    // Clean up whitespace/comments, and split into fields
    var fields = line.replace(/\s*#.*|^\s*|\s*$/g, '').split(/\s+/);
    map[fields.shift()] = fields;
  });

  this.define(map);

  this._loading = null;
};

/**
 * Lookup a mime type based on extension
 */
Mime.prototype.lookup = function(path, fallback) {
  var ext = path.replace(/.*[\.\/\\]/, '').toLowerCase();

  return this.types[ext] || fallback || this.default_type;
};

/**
 * Return file extension associated with a mime type
 */
Mime.prototype.extension = function(mimeType) {
  var type = mimeType.match(/^\s*([^;\s]*)(?:;|\s|$)/)[1].toLowerCase();
  return this.extensions[type];
};

// Default instance
var mime = new Mime();

// Load local copy of
// http://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types
mime.load(path.join(__dirname, 'types/mime.types'));

// Load additional types from node.js community
mime.load(path.join(__dirname, 'types/node.types'));

// Default type
mime.default_type = mime.lookup('bin');

//
// Additional API specific to the default instance
//

mime.Mime = Mime;

/**
 * Lookup a charset based on mime type.
 */
mime.charsets = {
  lookup: function(mimeType, fallback) {
    // Assume text types are utf8
    return (/^text\//).test(mimeType) ? 'UTF-8' : fallback;
  }
};

module.exports = mime;

}).call(this,_dereq_("FWaASH"),"/../node_modules/rework/node_modules/mime")
},{"FWaASH":61,"fs":56,"path":60}],139:[function(_dereq_,module,exports){
var debug = _dereq_('debug')('rework-inherit')

exports = module.exports = function (options) {
  return function inherit(style) {
    return new Inherit(style, options || {})
  }
}

exports.Inherit = Inherit

function Inherit(style, options) {
  if (!(this instanceof Inherit))
    return new Inherit(style, options);

  options = options || {}

  this.propertyRegExp = options.propertyRegExp
    || /^(inherit|extend)s?$/i

  var rules = this.rules = style.rules
  this.matches = {}

  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i]
    if (rule.rules) {
      // Media queries
      this.inheritMedia(rule)
      if (!rule.rules.length) rules.splice(i--, 1);
    } else if (rule.selectors) {
      // Regular rules
      this.inheritRules(rule)
      if (!rule.declarations.length) rules.splice(i--, 1);
    }
  }

  this.removePlaceholders()
}

Inherit.prototype.inheritMedia = function (mediaRule) {
  var rules = mediaRule.rules
  var query = mediaRule.media

  for (var i = 0; i < rules.length; i++) {
    var rule = rules[i]
    if (!rule.selectors) continue;

    var additionalRules = this.inheritMediaRules(rule, query)

    if (!rule.declarations.length) rules.splice(i--, 1);

    // I don't remember why I'm using apply here.
    ;[].splice.apply(rules, [i, 0].concat(additionalRules))
    i += additionalRules.length
  }
}

Inherit.prototype.inheritMediaRules = function (rule, query) {
  var declarations = rule.declarations
  var selectors = rule.selectors
  var appendRules = []

  for (var i = 0; i < declarations.length; i++) {
    var decl = declarations[i]
    // Could be comments
    if (decl.type !== 'declaration') continue;
    if (!this.propertyRegExp.test(decl.property)) continue;

    decl.value.split(',').map(trim).forEach(function (val) {
      // Should probably just use concat here
      ;[].push.apply(appendRules, this.inheritMediaRule(val, selectors, query));
    }, this)

    declarations.splice(i--, 1)
  }

  return appendRules
}

Inherit.prototype.inheritMediaRule = function (val, selectors, query) {
  var matchedRules = this.matches[val] || this.matchRules(val)
  var alreadyMatched = matchedRules.media[query]
  var matchedQueryRules = alreadyMatched || this.matchQueryRule(val, query)

  if (!matchedQueryRules.rules.length)
    throw new Error('Failed to extend as media query from ' + val + '.');

  debug('extend %j in @media %j with %j', selectors, query, val);

  this.appendSelectors(matchedQueryRules, val, selectors)

  return alreadyMatched
    ? []
    : matchedQueryRules.rules.map(getRule)
}

Inherit.prototype.inheritRules = function (rule) {
  var declarations = rule.declarations
  var selectors = rule.selectors

  for (var i = 0; i < declarations.length; i++) {
    var decl = declarations[i]
    // Could be comments
    if (decl.type !== 'declaration') continue;
    if (!this.propertyRegExp.test(decl.property)) continue;

    decl.value.split(',').map(trim).forEach(function (val) {
      this.inheritRule(val, selectors)
    }, this)

    declarations.splice(i--, 1)
  }
}

Inherit.prototype.inheritRule = function (val, selectors) {
  var matchedRules = this.matches[val] || this.matchRules(val)

  if (!matchedRules.rules.length)
    throw new Error('Failed to extend from ' + val + '.');

  debug('extend %j with %j', selectors, val);

  this.appendSelectors(matchedRules, val, selectors)
}

Inherit.prototype.matchQueryRule = function (val, query) {
  var matchedRules = this.matches[val] || this.matchRules(val)

  return matchedRules.media[query] = {
    media: query,
    rules: matchedRules.rules.map(function (rule) {
      return {
        selectors: rule.selectors,
        declarations: rule.declarations,
        rule: {
          type: 'rule',
          selectors: [],
          declarations: rule.declarations
        }
      }
    })
  }
}

Inherit.prototype.matchRules = function (val) {
  var matchedRules = this.matches[val] = {
    rules: [],
    media: {}
  }

  this.rules.forEach(function (rule) {
    if (!rule.selectors) return;

    var matchedSelectors = rule.selectors.filter(function (selector) {
      return selector.match(replaceRegExp(val))
    })

    if (!matchedSelectors.length) return;

    matchedRules.rules.push({
      selectors: matchedSelectors,
      declarations: rule.declarations,
      rule: rule
    })
  })

  return matchedRules
}

Inherit.prototype.appendSelectors = function (matchedRules, val, selectors) {
  matchedRules.rules.forEach(function (matchedRule) {
    // Selector to actually inherit
    var selectorReference = matchedRule.rule.selectors

    matchedRule.selectors.forEach(function (matchedSelector) {
      ;[].push.apply(selectorReference, selectors.map(function (selector) {
        return replaceSelector(matchedSelector, val, selector)
      }))
    })
  })
}

// Placeholders are not allowed in media queries
Inherit.prototype.removePlaceholders = function () {
  var rules = this.rules

  for (var i = 0; i < rules.length; i++) {
    var selectors = rules[i].selectors
    if (!selectors) continue;

    for (var j = 0; j < selectors.length; j++) {
      var selector = selectors[j]
      if (~selector.indexOf('%')) selectors.splice(j--, 1);
    }

    if (!selectors.length) rules.splice(i--, 1);
  }
}

function replaceSelector(matchedSelector, val, selector) {
  return matchedSelector.replace(replaceRegExp(val), function (_, first, last) {
    return first + selector + last
  })
}

function replaceRegExp(val) {
  return new RegExp(
    '(^|\\s|\\>|\\+|~)' +
    escapeRegExp(val) +
    '($|\\s|\\>|\\+|~|\\:)'
    , 'g'
  )
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
}

function trim(x) {
  return x.trim()
}

function getRule(x) {
  return x.rule
}

},{"debug":134}],140:[function(_dereq_,module,exports){
module.exports=_dereq_(100)
},{}]},{},[1])
(1)
});