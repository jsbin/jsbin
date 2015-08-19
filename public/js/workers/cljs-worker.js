'use strict';

// alias for cljs runtime
var window = this;

var log = [];

// intercept and collect console calls from within ClojureScript source
console.log = function() {
  log.push({ sev: 'log', args: toArgsStr(arguments) });
};

console.error = function() {
  log.push({ sev: 'error', args: toArgsStr(arguments) });
};

var consoleSev = {
  log: function(args) {
    return 'console.log("' + args + '");';
  },
  error: function(args) {
    return 'console.error("' + args + '");';
  }
};

function toArgsStr(args) {
  return Array.prototype.slice.call(args).join(',');
}

function appendLog(result) {
  return '(function(){' +
         log.map(function(l) { return consoleSev[l.sev](l.args); }).join('') +
         '})();';
}

function resetNS(code) {
  return '(ns cljs.user)' + code;
}

onmessage = function(event) {

  // load self-hoasted ClojureScript
  if (event.data.name === 'cljs') {
    importScripts(event.data.path);
    postMessage({ name: 'ready' });
  }

  // evaluate code
  if (event.data.name === 'eval') {
    jsbin_cljs.core.eval_expr(resetNS(event.data.code), function(err, result) {
      cljs.user = null;
      if (err) {
        log = [];
        throw Error(err);
      } else {
        postMessage({ name: 'eval', result: appendLog(eval(result)) });
        log = []; // reset collected log
      }
    });
  }
}
