// Metrics client using lynx
// git://github.com/dscape/lynx.git
var lynx = require('lynx');
module.exports = new lynx('localhost', 8125, { scope: 'jsbin' });