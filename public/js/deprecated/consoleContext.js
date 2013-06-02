function ConsoleContext(context) {
  var self = this;
  this.context = context;
  this.executable = typeof context == 'function';

  this.active = false;
  this.original = window.top.console;

  // yeah, lame, but we've no way to detect the console arguments support, because
  // it can only be tested from the /actual/ console.
  this.supported = /chrome/i.test(navigator.userAgent);
}

ConsoleContext.prototype = {
  hijack: function (method, args) {
    var context = this.executable ? this.context() : this.context;
    var re = new RegExp('console\.' + method + '\\((.*?)\\)');
    // if the log was triggered via a jQuery.Event then it came from /within/ the preview
    if (arguments.callee.caller.caller.arguments.length > 0 && !(arguments.callee.caller.caller.arguments[0] instanceof jQuery.Event) && context) {
      context.eval('console.' + method + '(' + arguments.callee.caller.caller.arguments[0].toString().match(re)[1] + ')');
    } else {
      this.original[method].apply(this.original, args);
    }
  },
  log: function () {
    this.hijack('log', [].slice.call(arguments));
  },
  debug: function () {
    this.hijack('debug', [].slice.call(arguments));
  },
  dir: function () {
    this.hijack('dir', [].slice.call(arguments));
  },
  warn: function () {
    this.hijack('warn', [].slice.call(arguments));
  },
  error: function () {
    this.hijack('error', [].slice.call(arguments));
  },
  activate: function () {
    if (this.supported) {
      window.top.console = this;
      if (console == this) this.original.log('--- console context switched to jsbin ---');
      this.active = true;
    }
  },
  deactivate: function () {
    if (this.supported) {
      this.active = false;
      if (console == this) this.original.log('--- console context switched back to original ---');
      window.top.console = this.original;
    }
  }
};