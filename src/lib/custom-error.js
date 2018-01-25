function CustomError({ detail } = {}) {
  this.name = 'CustomError';
  this.detail = detail;
  this.stack = new Error().stack;
}

CustomError.prototype = new Error();

export default CustomError;
