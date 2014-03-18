// environment=browser
// environment=jquery
// plugin=requirejs {"override": {"jquery": "=$"}}

requirejs(["foo", "bar!abc", "useexports", "simplifiedcommon", "subdir/zap"], function(foo, bar, useexports, simplified, zap) {
  foo.aString; //: string
  bar.aNumber; //: number
  bar.baz.bazProp; //: Date
  bar.baz.bazFooProp; //: string
  useexports.hello; //: bool
  simplified.hello; //: string
  simplified.func; //: fn() -> bool
  zap; //: string

  foo; //origin: foo.js
  bar; //origin: bar.js
  bar.baz; //origin: baz.js
});

requirejs(["jquery"], function($) {
  $.fx.off; //: bool
});
