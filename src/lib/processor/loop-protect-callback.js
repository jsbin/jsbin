export default function(lineno, colno) {
  const message = `Exiting potential infinite loop on line ${lineno}`;
  window.dispatchEvent(
    new CustomEvent('error', {
      detail: {
        error: {
          name: 'loopProtect',
          stack: `Use // noprotect to disable JS Bin's loop protection`,
        },
        lineno,
        colno,
        message,
      },
    })
  );
}
