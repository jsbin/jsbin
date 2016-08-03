var commandMaps = [
  {
    value: '➠',
    callback: function () { return this.complete(); }
  },
  {
    value: '{$0}',
    panel: 'css',
    callback: function () {
      return '{\n  $0\n}';
    },
  },
  {
    value: 'fn',
    callback: funtion () { return 'function $0() {\n  $1\n}' },
    panel: ['js', 'console']
  },
  {
    value: 'log',
    callback: function () { return 'console.log($0)' },
    panel: 'js',
  },
  {
    value: '<$0',
    panel: 'html',
  },
  {
    value: '>$0',
    panel: 'html',
  },
  {
    value: '</>',
    callback: function () { return this.close('>'); },
    panel: 'html',
  },
  {
    value: '="$0"',
    panel: 'html',
  },
  {
    value: '&rarr;|',
    callback: function () {
      return '  $0';
    },
  },
  {
    value: ': "$0";',
    panel: 'css',
  },
];


/**
 * Notes
 *
 * - Undo isn't really possible. I tried it. It was terrible.
 */
