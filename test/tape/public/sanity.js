var test = require('tape');

test('sanity', function (sanity) {

  sanity.test('1 + 1 = 2', function (t) {
    t.plan(1); 
    var one = 1;
    var two = 2;
    t.ok(one + one, two, '1 + 1 = 2');
  });
  
});
