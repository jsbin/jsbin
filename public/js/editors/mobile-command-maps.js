var commandMaps = [
  {
    value: '➠',
    callback: function () { return this.complete(); }
  },
  {
    value: 'fn',
    callback: function () { return 'function $0() {\n  \n}' },
    panel: ['js', 'console']
  },
  {
    value: '($0)',
    panel: ['js', 'console']
  },
  {
    value: '{$0}',
    panel: ['css', 'js'],
    callback: function () {
      return '{\n  $0\n}';
    },
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
