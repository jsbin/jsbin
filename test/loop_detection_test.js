var assert = require('assert');
var sinon = require('sinon');
var loopProtect = require('../public/js/runner/loop-protect');

// expose a window object for loopProtect compatibility
global.window = {
  runnerWindow: loopProtect
};

var code = {
  simple: 'return "remy";',
  simplefor: 'var mul = 1; for (var i = 0; i < 10; i++) {\nmul = i;\n}\nreturn mul',
  onelinefor: 'var i = 0, j = 0;\nfor (; i < 10; i++) j = i * 10;\nreturn i;',
  simplewhile: 'var i = 0; while (i < 100) {\ni += 10;\n}\nreturn i;',
  onelinewhile: 'var i = 0; while (i < 100) i += 10;\nreturn i;',
  whiletrue: 'var i = 0;\nwhile(true) {\ni++;\n}\nreturn i;',
  irl1: 'var nums = [0,1];\n var total = 8;\n for(var i = 0; i <= total; i++){\n var newest = nums[i--]\n nums.push(newest);\n }\n return (nums);',
  irl2: 'var a = 0;\n for(var j=1;j<=2;j++){\n for(var i=1;i<=60000;i++) {\n a += 1;\n }\n }\n return a;',
  notloops: 'console.log("do");\nconsole.log("while");\nconsole.log(" foo do bar ");\nconsole.log(" foo while bar ");\n',
  notprops: "var foo = { 'do': 'bar' }; return foo['do'] && foo.do",
  notcomments: "var foo = {}; // do the awesome-ness!\nreturn true",
};


describe('loop', function () {
  var spy;

  function run(code) {
    return (new Function(code))();
  }

  beforeEach(function () {
    spy = sinon.spy(run);
  });


  it('should leave none loop code alone', function () {
    assert(loopProtect.rewriteLoops(code.simple) === code.simple);
  });

  it('should rewrite for loops', function () {
    var compiled = loopProtect.rewriteLoops(code.simplefor);
    assert(compiled !== code);
    var result = run(compiled);
    assert(result === 9);
  });

  it('should rewrite one line for loops', function () {
    var compiled = loopProtect.rewriteLoops(code.onelinefor);
    assert(compiled !== code);
    var result = run(compiled);
    assert(result === 10);
  });

  it('should throw on infinite while', function () {
    var compiled = loopProtect.rewriteLoops(code.whiletrue);

    try { spy(compiled); } catch (e) {}

    assert(spy.threw);
  });

  it('should throw on infinite for', function () {
    var compiled = loopProtect.rewriteLoops(code.irl1);
    try { spy(compiled); } catch (e) {}
    assert(spy.threw);
  });

  it('should allow nested loops to run', function () {
    var compiled = loopProtect.rewriteLoops(code.irl2);
    assert(run(compiled) === 120000);
  });

  it('should not rewrite "do" in strings', function () {
    var compiled = loopProtect.rewriteLoops(code.notloops);
    assert(compiled === code.notloops);
  });


  it('should not rewrite "do" in object properties', function () {
    var compiled = loopProtect.rewriteLoops(code.notprops);
    console.log(compiled);
    assert(compiled === code.notprops);
  });

  it('should not rewrite "do" in comments', function () {
    var compiled = loopProtect.rewriteLoops(code.notcomments);
    // console.log(compiled);
    assert(compiled === code.notcomments);
  });

});