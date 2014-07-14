'use strict';

var expect = require('chai').expect;
var Sass = require('../dist/sass.min.js');

describe('option.comments', function() {

  it('should add line comments', function(done) {
    var source = '@import "testfile";\n\n$foo:123px;\n\n.m {\n  width:$foo;\n}';
    var expected = '/* line 1, /sass/testfile */\n.imported {\n  content: "testfile"; }\n\n/* line 5, source string */\n.m {\n  width: 123px; }\n';
    
    Sass.options({comments: true});
    Sass.writeFile('testfile.scss', '.imported { content: "testfile"; }');
    var result = Sass.compile(source);
    Sass.options({comments: false});
    
    expect(result).to.equal(expected);
    
    done();
  });

});