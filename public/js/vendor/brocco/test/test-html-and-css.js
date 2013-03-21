(function() {
  module("html-and-css");
  
  function makeSections(ext, code, fn) {
    var sections;
    Brocco.languages[ext].makeSections("", code, {}, function(s) {
      sections = s;
    });
    return sections;
  }
  
  test("works when /* */ comment follows // comment", function() {
    deepEqual(makeSections(".html", [
      '<script>// hi',
      '/* there */</script>'
    ].join('\n')).map(function(section) {
      return section.docsText;
    }), ['', 'hi\n', 'there ']);
  });
  
  test("works with HTML comments", function() {
    deepEqual(makeSections(".html", [
      '<br>',
      '<!-- hi',
      '     there -->',
      '<p>sup</p>'
    ].join('\n')).map(function(section) {
      return section.docsText;
    }), ['', 'hi\nthere ']);
  });
  
  test("works w/ .css files", function() {
    deepEqual(makeSections(".css", [
      'body {',
      '  /* cool */',
      '  color: blue;',
      '}'
    ].join('\n')).map(function(section) {
      return section.docsText;
    }), ['', 'cool ']);
  });
})();
