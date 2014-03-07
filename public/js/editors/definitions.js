var ternDefinitions = [
  {
    name: 'jquery',
    type: 'def',
    file: jsbin.static + '/js/vendor/tern/defs/jquery.json',
    match:  /jquery.*?\.js"><\/script>/i
  },
  {
    name: 'underscore',
    type: 'def',
    file: jsbin.static + '/js/vendor/tern/defs/underscore.json',
    match:  /underscore.*?\.js"><\/script>/i
  },
  {
    name: 'kendo',
    type: 'file',
    file: jsbin.static + '/js/vendor/tern/defs/kendo.all.min.js',
    match:  /kendo.*?\.js"><\/script>/i
  }
];