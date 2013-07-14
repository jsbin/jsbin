var jsbin = {};
global.jsbin = jsbin; // let loopDetect hook jsbin

var assert = require('assert');
var sinon = require('sinon');
var loopDetect = require('../public/js/render/infinite-loop-test');
jsbin.LOOPCOUNT = loopDetect.detect;

var code = {
  simple: 'return "remy";',
  simplefor: 'var mul = 1; for (var i = 0; i < 10; i++) {\nmul = i;\n}\nreturn mul',
  onelinefor: 'var i = 0, j = 0;\nfor (; i < 10; i++) j = i * 10;\nreturn i;',
  simplewhile: 'var i = 0; while (i < 100) {\ni += 10;\n}\nreturn i;',
  onelinewhile: 'var i = 0; while (i < 100) i += 10;\nreturn i;',
  whiletrue: 'var i = 0;\nwhile(true) {\ni++;\n}\nreturn i;',
  irl1: 'var nums = [0,1];\n var total = 8;\n for(i = 0; i <= total; i++){\n var newest = nums[i--]\n nums.push(newest);\n }\n return (nums);',
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
    assert(loopDetect.convert(code.simple) === code.simple);
  });

  it('should rewrite for loops', function () {
    var compiled = loopDetect.convert(code.simplefor);
    assert(compiled !== code);
    var result = run(compiled);
    assert(result === 9);
  });

  it('should rewrite one line for loops', function () {
    var compiled = loopDetect.convert(code.onelinefor);
    assert(compiled !== code);
    var result = run(compiled);
    assert(result === 10);
  });

  it('should throw on infinite while', function () {
    var compiled = loopDetect.convert(code.whiletrue);

    try { spy(compiled); } catch (e) {}

    assert(spy.threw);
  });

  it('should throw on infinite for', function () {
    var compiled = loopDetect.convert(code.irl1);
    try { spy(compiled); } catch (e) {}
    assert(spy.threw);
  });

});