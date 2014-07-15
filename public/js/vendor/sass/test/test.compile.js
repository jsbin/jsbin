'use strict';

var expect = require('chai').expect;
var Sass = require('../dist/sass.min.js');

describe('Sass.compile()', function() {

  it('should return CSS', function(done) {
    var source = '$foo:123px;\n\n.m {\n  width:$foo;\n}';
    var expected = '.m {\n  width: 123px; }\n';
    var result = Sass.compile(source);
    expect(result).to.equal(expected);

    done();
  });

  it('should return parse errors', function(done) {
    var source = '$foo:123px;\n\n.m {\n  width:$foo;\n}\n\nfoobar';
    var result = Sass.compile(source);
    expect(result).to.be.a('object');
    expect(result.line).to.equal(7);
    expect(result.message).to.equal('error: invalid top-level expression');

    done();
  });
  
});