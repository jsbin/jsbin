var fs = require('fs');
var Benchmark = require('benchmark');
var nodeSass = require('node-sass');
var libSass = require('../dist/sass.min.js');
var source = fs.readFileSync(__dirname + '/../scss/demo.scss');

var suite = new Benchmark.Suite();
// add tests
suite.add('sass.js', function() {
  libSass.compile(source);
})
.add('node-sass', function() {
  nodeSass.renderSync({
    data: source
  });
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });

