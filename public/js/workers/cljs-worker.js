'use strict';

// alias for cljs runtime
var window = this;

onmessage = function(event) {

  // load self-hoasted ClojureScript
  if (event.data.name === 'cljs') {
    importScripts(event.data.path);
    postMessage({ name: 'ready' });
  }

  // evaluate code
  if (event.data.name === 'eval') {
    jsbin_cljs.core.eval_expr(event.data.code, function(err, result) {
      if (err) {
        throw Error(err);
      } else {
        postMessage({ name: 'eval', result: eval(result) + '' });
      }
    });
  }
}
