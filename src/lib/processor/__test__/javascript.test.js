import { transform } from '../javascript';

const protect = function(state) {
  const line = (protect.counters[state.line] =
    protect.counters[state.line] || {});
  const now = Date.now();

  if (state.reset) {
    line.time = now;
  }

  if (now - line.time > protect.timeout) {
    // We've spent over 100ms on this loop... smells infinite.
    protect.hit(state.line);
    // Returning true prevents the loop running again
    return true;
  }

  return false;
};

const LP = Object.assign(protect, {
  timeout: 100, // ms
  counters: {},
  alias: 'LP',
  hit: line => {
    const msg = `Exiting potential infinite loop at line ${line}. To disable loop protection: add "// noprotect" to your code`;
    console.error(msg);
  },
  reset: function() {
    this.counters = {};
  },
});

const build = async code => await transform(new Function(code).toString()); // eslint-disable-line no-new-func

const run = async code => eval(`(${await build(code)})()`); // eslint-disable-line no-eval

test('LP looks right', () => {
  expect(typeof LP).toBe('function');
  expect(LP.alias).toBe('LP');
});

test('simple code is unchanged', async () => {
  const code = 'return 10';
  const res = await run(code);
  expect(res).toEqual(10);
});

test('noprotect works', async () => {
  const code = `
  for (var i = 0; i < 10; i++) { }; //noprotect
  return i;`;

  const res = await build(code);
  expect(res).toEqual(new Function(code).toString());
});

test('transform a while loop', async () => {
  const code = `var i = 0;
    while (true) {
      i++;
    }

    var j = 0;
    while (true) {
      j++;
    }
    return "∞"`;

  LP.hit = () => {};
  const res = await run(code);
  expect(res).toEqual('∞');
});

test('without deps', async () => {
  const code = `var i = 0;
    while (true) {
      i++;
    }

    var j = 0;
    while (true) {
      j++;
    }
    return "∞"`;

  LP.hit = () => {};
  const res = await build(code);
  console.log(res);
});
