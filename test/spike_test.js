// var spike = require('../lib/spike');

// describe('splike.utils.makeEvent', function () {

//   it('should convert some string data into a valid event', function () {
//     var result = spike.utils.makeEvent('example', 'hello');
//     result.should.equal([
//       'data:hello',
//       'event:example',
//       '\n'
//     ].join('\n'));
//   });

//   it('should convert and object into a valid event', function () {
//     var result = spike.utils.makeEvent('example', {
//       a: 10,
//       b: 20
//     });
//     result.should.equal([
//       'data:{"a":10,"b":20}',
//       'event:example',
//       '\n'
//     ].join('\n'));
//   });

//   it('should create an event even if no data is passed', function () {
//     var result = spike.utils.makeEvent('example');
//     result.should.equal([
//       'event:example',
//       '\n'
//     ].join('\n'));
//   });

//   it('should return nothing if nothing is passed', function () {
//     var result = spike.utils.makeEvent();
//     result.should.equal('');
//   });

// });