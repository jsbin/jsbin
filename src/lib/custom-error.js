function CustomError({ detail } = {}) {
  this.name = 'CustomError';
  this.detail = detail;
  this.stack = new Error().stack;
}

CustomError.prototype = new Error();

export default CustomError;

export const babelError = e => {
  const warning =
    'Failed to compile - if this continues, please file a new issue and include this full source and configuration';
  // console.groupCollapsed(warning);
  console.group(warning);
  console.log(e);
  console.groupEnd(warning);

  const message = e.message.split('\n').shift();
  throw new CustomError({
    message,
    detail: {
      name: e.name,
      message,
      line: e.loc.line,
      ch: e.loc.column,
    },
  });
};
