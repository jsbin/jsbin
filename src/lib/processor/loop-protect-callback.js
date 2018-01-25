import error from '../runner/error';

export default function(lineno, colno) {
  error({
    name: 'loopProtect',
    stack: `Use // noprotect to disable JS Bin's loop protection`,
    lineno,
    colno,
    message: `Exiting potential infinite loop on line ${lineno}`,
  });
}
