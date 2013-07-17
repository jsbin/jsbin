var assert = require('assert');
var sinon = require('sinon');
var loopProtect = require('../public/js/runner/loop-protect');

// expose a window object for loopProtect compatibility
global.window = {
  runnerWindow: loopProtect
};

var code = {
  simple: 'return "remy";',
  simplefor: 'var mul = 1; for (var i = 0; i < 10; i++) {\nmul = i;\n}\nreturn i',
  simplefor2: 'for (var i = 0; i < 10; i++) {\nmul = i;\n}\nreturn i',
  onelinefor: 'var i = 0, j = 0;\nfor (; i < 10; i++) j = i * 10;\nreturn i;',
  simplewhile: 'var i = 0; while (i < 100) {\ni += 10;\n}\nreturn i;',
  onelinewhile: 'var i = 0; while (i < 100) i += 10;\nreturn i;',
  whiletrue: 'var i = 0;\nwhile(true) {\ni++;\n}\nreturn true;',
  irl1: 'var nums = [0,1];\n var total = 8;\n for(var i = 0; i <= total; i++){\n var newest = nums[i--]\n nums.push(newest);\n }\n return i;',
  irl2: 'var a = 0;\n for(var j=1;j<=2;j++){\n for(var i=1;i<=60000;i++) {\n a += 1;\n }\n }\n return a;',
  notloops: 'console.log("do");\nconsole.log("while");\nconsole.log(" foo do bar ");\nconsole.log(" foo while bar ");\nreturn true;',
  notprops: "var foo = { 'do': 'bar' }; if (foo['do'] && foo.do) {}\nreturn true;",
  notcomments: "var foo = {}; // do the awesome-ness!\nreturn true;",
  dirtybraces: "var a = 0; for(var i=1;i<=120000; i++)\n {\n a += 1;\n }\nreturn a;",
  onelinenewliner: "var b=0;\n function f(){b+=1;}\n for(var j=1;j<120000; j++)\n f();\nreturn j;",
  irl3: "Todos.Todo = DS.Model.extend({\n title: DS.attr('string'),\n isCompleted: DS.attr('boolean')\n });"
};


describe('loop', function () {
  var spy;

  function run(code) {
    var r = (new Function(code))();
    return r;
  }

  beforeEach(function () {
    spy = sinon.spy(run);
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

    var c = code.simplefor2;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    var result = run(compiled);
    assert(result === 10);
  });

  it('should rewrite one line for loops', function () {
    var c = code.onelinefor;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    var result = run(compiled);
    assert(result === 10);
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
    assert(compiled !== c);
    assert(run(compiled) === 120000);
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
    var c = code.irl3;
    var compiled = loopProtect.rewriteLoops(c);
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
    assert(compiled !== c);
    assert(spy(compiled) === 120000);

  });

  it('should find one liners on multiple lines', function () {
    var c = code.onelinenewliner;
    var compiled = loopProtect.rewriteLoops(c);
    assert(compiled !== c);
    assert(spy(compiled) === 120000);
  });

});