(function() {
  module("brocco");

  test("works w/o CodeMirror", utils.noGlobal("CodeMirror", function() {
    Brocco.document("foo.js", {code: "foo();"}, function(html) {
      equal(utils.selectHtml(html, "td.code"), '<pre>foo();\n</pre>');
    });
  }));
})();
