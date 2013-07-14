var counters = {};

function infiniteLoopTest(code) {
  var lines = code.split('\n'),
      recompiled = [],
      re = /for\b|while\b|do\b/;

  // reset the counters
  counters = {};

  lines.forEach(function (line, i) {
    var index = 0;
    if (re.test(line)) {
      // try to insert the tracker after the openning brace (like while (true) { ^here^ )
      index = line.indexOf('{');
      if (index !== -1) {
        // parseFor(line, i);
        line = line.substring(0, index + 1) + ';\njsbin.LOOPCOUNT({ line: ' + i + ' });';
      } else {
        index = line.indexOf(')');
        if (index !== -1) {
          // look for a one liner
          var colonIndex = line.substring(index).indexOf(';');
          if (colonIndex !== -1) {
            // in which case, rewrite the loop to add braces
            colonIndex += index;
            line = line.substring(0, index + 1) + '{\njsbin.LOOPCOUNT({ line: ' + i + ' });\n' + line.substring(index + 1) + '}\n';
;
          }
        }
      }
      counters[i] = { count: 0, last: +new Date() };
    }
    recompiled.push(line);
  });

  return recompiled.join('\n');
}


function detect(state) {
  var line = counters[state.line];
  line.count++;
  if (line.count > 100000) {
    // we've done a ton of loops, then let's say it smells like an infinite loop
    throw new Error("Suspicious loop detected at line " + state.line);
  }
}

jsbin.LOOPCOUNT = detect;

if (typeof exports !== 'undefined') {
  module.exports = {
    convert: infiniteLoopTest,
    detect: detect
  };
}


// function testForHang(callback) {
//   var worker = new Worker(jsbin.root + '/js/render/infinite-loop-test-worker.js'),
//       timer = null;

//   worker.onmessage = function (e) {
//     clearTimeout(timer);
//     if (e.data.code === 'READY') {
//       timer = setTimeout(function () {
//         worker.terminate();
//         callback(false);
//       }, 100);
//     } else if (e.data.code === 'DONE') {
//       clearTimeout(timer);
//       callback(true);
//     } else if (false && e.data.code === 'ERROR') { // ignore errors for now
//       clearTimeout(timer);
//       callback(false);
//     } else {
// //      console.log('unexpected response from loop worker');
//       callback(true);
//     }

//   };
//   worker.postMessage(jsbin.panels.panels.javascript.getCode());
// }
