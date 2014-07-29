'use strict';
/*global describe:true, it: true, beforeEach: true */
var assert = require('assert');
var sinon = require('sinon');
var pwd = process.cwd();
var loopProtect = require(pwd + '/public/js/vendor/loop-protect.min');

// expose a window object for loopProtect compatibility
global.window = {
  runnerWindow: loopProtect
};

var code = {
  simple: 'return "remy";',
  simplefor: 'var mul = 1; for (var i = 0; i < 10; i++) {\nmul = i;\n}\nreturn i',
  simplefor2: 'for (var i = 0; i < 10; i++) {\nmul = i;\n}\nreturn i',
  onelinefor: 'var i = 0, j = 0;\nfor (; i < 10; i++) j = i * 10;\nreturn i;',
  onelinefor2: 'var i=0;\nfor(i=0; i<10; ++i){ break; }\nreturn i;',
  simplewhile: 'var i = 0; while (i < 100) {\ni += 10;\n}\nreturn i;',
  onelinewhile: 'var i = 0; while (i < 100) i += 10;\nreturn i;',
  onelinewhile2: 'function noop(){}; while (1) noop("Ha.");',
  whiletrue: 'var i = 0;\nwhile(true) {\ni++;\n}\nreturn true;',
  irl1: 'var nums = [0,1];\n var total = 8;\n for(var i = 0; i <= total; i++){\n var newest = nums[i--]\n nums.push(newest);\n }\n return i;',
  irl2: 'var a = 0;\n for(var j=1;j<=2;j++){\n for(var i=1;i<=60000;i++) {\n a += 1;\n }\n }\n return a;',
  notloops: 'console.log("do");\nconsole.log("while");\nconsole.log(" foo do bar ");\nconsole.log(" foo while bar ");\nreturn true;',
  notprops: 'var foo = { "do": "bar" }; if (foo["do"] && foo.do) {}\nreturn true;',
  notcomments: 'var foo = {}; // do the awesome-ness!\nreturn true;',
  dirtybraces: 'var a = 0; for(var i=1;i<=10000; i++)\n {\n a += 1;\n }\nreturn a;',
  onelinenewliner: 'var b=0;\n function f(){b+=1;}\n for(var j=1;j<10000; j++)\n f();\nreturn j;',
  irl3: 'Todos.Todo = DS.Model.extend({\n title: DS.attr("string"),\n isCompleted: DS.attr("boolean")\n });',
  brackets: 'var NUM=103, i, sqrt;\nfor(i=2; i<=Math.sqrt(NUM); i+=1){\n if(NUM % i === 0){\n  console.log(NUM + " can be divided by " + i + ".");\n  break;\n }\n}\nreturn i;',
  lotolines: 'var LIMIT = 10;\nvar num, lastNum, tmp;\nfor(num = 1, lastNum = 0;\n  num < LIMIT;\n  lastNum = num, num = tmp){\n\n    tmp = num + lastNum;\n}\nreturn lastNum;',
  ignorecomments: '\n/**\n * This function handles the click for every button.\n *\n * Using the same function reduces code duplication and makes the\n */\nreturn true;',
  dowhile: 'var x=0;\ndo\n {\n x++;\n } while (x < 3);\nreturn x;',
  dowhilenested: 'var x=0;\n do\n {\n x++;\n var b = 0;\n do {\n b++; \n } while (b < 3);\n } while (x < 3);\nreturn x;',
  disabled: '// noprotect\nvar x=0;\ndo\n {\n x++;\n } while (x < 3);\nreturn x;',
  continues: 'var n = 0,\n i = 0,\n j = 0;\n \n outside:\n for (i; i < 10; i += 1) {\n for (j; j < 10; j += 1) {\n if (i === 5 && j === 5) {\n continue outside;\n }\n n += 1;\n }\n }\n \n return n;\n;',
  labelWithComment: 'label:\n// here be a label\n/*\n and there\'s some good examples in the loop - poop\n*/\nfor (var i = 0; i < 10; i++) {\n}\nreturn i;',
  continues2: 'var x = 0;\nLABEL1: do {\n  x = x + 2;\n  if (x < 100) break LABEL1;\n  if (x < 100) continue LABEL1;\n} \nwhile(0);\n\nreturn x;',
  onelineforinline: 'function init() {\n  for (var i=0;i<2;i++) (function(n) {\nconsole.log(i)})(i);\n}return true;',
  notlabels: 'var foo = {\n bar: 1\n };\n \n function doit(i){}\n \n for (var i=0; i<10; i++) {\n doit(i);\n }\n return i;',
  notlabels2: '// Weird:\nfor (var i = 0; i < 10; i++) {}\nreturn i;',
  cs: 'var bar, foo;\n\nfoo = function(i) {\n  return {\n    id: i\n  };\n};\n\nbar = function(i) \n\n  var j, _i, _results;\n\n  _results = [];\n  for (j = _i = 1; 1 <= i ? _i < i : _i > i; j = 1 <= i ? ++_i : --_i) {\n    _results.push(j);\n  }\n  return _results;\n};',
};

var spy;

function run(code) {
  var r = (new Function(code))(); // jshint ignore:line
  return r;
}

describe('loop', function () {
  beforeEach(function () {
    spy = sinon.spy(run);
    loopProtect.debug(false);
  });

  it('should ignore comments', function () {
    var c = code.ignorecomments;
    var compiled = loopProtect.rewriteLoops(c);
    // console.log('\n---------\n' + c + '\n---------\n' + compiled);
    assert(compiled === c);
    var result = run(compiled);
    assert(result === true);
  });

  it('should leave none loop code alone', function () {
    assert(loopProtect.rewriteLoops(code.simple) === code.simple);
  });

  it('should rewrite for loops', function () {
    var c = code.simplefor;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    var result = run(compiled);
    assert(result === 10);

    c = code.simplefor2;
    compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    result = run(compiled);
    assert(result === 10);
  });

  it('should handle one liner for with an inline function', function () {
    var c = code.onelineforinline;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    var result = run(compiled);
    assert(result === true, 'value is ' + result);
  });

  it('should rewrite one line for loops', function () {
    var c = code.onelinefor;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    var result = run(compiled);
    assert(result === 10);

    c = code.onelinefor2;
    compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);

    // console.log('\n---------\n' + c + '\n---------\n' + compiled);

    result = run(compiled);
    assert(result === 0);
  });

  it('should rewrite one line while loops', function () {
    var c = code.onelinewhile2;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    // console.log('\n---------\n' + c + '\n---------\n' + compiled);
    var result = run(compiled);
    assert(result === undefined);
  });

  it('should protect infinite while', function () {
    var c = code.whiletrue;
    var compiled = loopProtect.rewriteLoops(c);

    assert(compiled !== c);
    assert(spy(compiled) === true);
  });

  it('should protect infinite for', function () {
    var c = code.irl1;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    assert(spy(compiled) === 0);
  });

  it('should allow nested loops to run', function () {
    var c = code.irl2;
    var compiled = loopProtect.rewriteLoops(c);
    var r = run(compiled);
    assert(compiled !== c);
    assert(r === 120000, r);
  });

  it('should not rewrite "do" in strings', function () {
    var c = code.notloops;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled === c);
  });


  it('should not rewrite "do" in object properties', function () {
    var c = code.notprops;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled === c);
    c = code.irl3;
    compiled = loopProtect.rewriteLoops(c);
    assert(compiled === c);
  });

  it('should not rewrite "do" in comments', function () {
    var c = code.notcomments;
    var compiled = loopProtect.rewriteLoops(c);
    // console.log(compiled);
    assert(compiled === c);
    assert(spy(compiled) === true);
  });

  it('should rewrite loops when curlies are on the next line', function () {
    var c = code.dirtybraces;
    var compiled = loopProtect.rewriteLoops(c);
    var r = spy(compiled);
    assert(compiled !== c);
    assert(r === 10000, r);
  });

  it('should find one liners on multiple lines', function () {
    var c = code.onelinenewliner;
    var compiled = loopProtect.rewriteLoops(c);
    var r = spy(compiled);
    // console.log('\n----------');
    // console.log(c);
    // console.log('\n----------');
    // console.log(compiled);
    assert(compiled !== c, compiled);
    assert(r === 10000, 'return value does not match 10000: ' + r);
  });

  it('should handle brackets inside of loop conditionals', function () {
    var c = code.brackets;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    assert(spy(compiled) === 11);
  });

  it('should not corrupt multi-line (on more than one line) loops', function () {
    var c = code.lotolines;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    assert(spy(compiled) === 8);
  });

  it('should ignore when loop protect is disabled', function () {
    var c = code.disabled;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled === c);
    assert(spy(compiled) === 3);
  });

  it('should protect do loops', function () {
    var c = code.dowhile;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    assert(spy(compiled) === 3);

    c = code.dowhilenested;
    compiled = loopProtect.rewriteLoops(c);
    // console.log('\n----------');
    // console.log(c);
    // console.log('\n----------');
    // console.log(compiled);
    assert(compiled !== c);
    assert(spy(compiled) === 3);

  });
});

describe('labels', function () {
  beforeEach(function () {
    spy = sinon.spy(run);
    loopProtect.debug(false);
  });

  it('should handle continue statements and gotos', function () {
    var c = code.continues;
    var compiled = loopProtect.rewriteLoops(c);
    assert(spy(compiled) === 10);

    c = code.continues2;
    compiled = loopProtect.rewriteLoops(c);
    assert(spy(compiled) === 2);
  });

  it('should handle labels with comments', function () {
    var c = code.labelWithComment;
    var compiled = loopProtect.rewriteLoops(c);
    assert(spy(compiled) === 10);
  });

  it('should handle things that *look* like labels', function () {
    var c = code.notlabels2;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    var result = run(compiled);
    assert(result === 10, 'actual ' + result);

    c = code.notlabels;
    compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    result = run(compiled);
    assert(result === 10, 'actual ' + result);

    // c = code.cs;
    // compiled = loopProtect.rewriteLoops(c);
    // assert(compiled !== c);
    // result = run(compiled);
    // assert(result === 10, 'actual ' + result);
  });

});