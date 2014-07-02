# Sass.js

Sass parser in JavaScript. This is a convenience API for the [emscripted](https://github.com/rodneyrehm/libsass) [libsass](https://github.com/hcatlin/libsass) (at v1.0.1). If you're looking to run Sass in node, you're probably looking for [node-sass](https://github.com/andrew/node-sass). Sass.js and node-sass should generate the same results.

> A fair warning: minified it's 2MB, gzipped it's 550KB. [node-sass](https://github.com/andrew/node-sass) is about 20 times faster than Sass.js

see the [live demo](http://medialize.github.com/sass.js/)

## Loading the Sass.js API

Sass.js comes in two flavors – the synchronous in-document `sass.js` and the asynchronous worker `sass.worker.js`. The primary API - wrapping the Emscripten runtime - is provided with `sass.js` (it is used internally by `sass.worker.js` as well). `sass.worker.js` mimics the same API (adding callbacks for the asynchronous part) and passes all the function calls through to the [web worker](https://developer.mozilla.org/en/docs/Web/API/Worker).

### Synchronous in-document sass.js

```html
<script src="dist/sass.min.js"></script>
<script>
  var scss = '$someVar: 123px; .some-selector { width: $someVar; }';
  var css = Sass.compile(scss);
  console.log(css);
</script>
```

### Asynchronous worker sass.worker.js

```html
<script src="dist/sass.worker.js"></script>
<script>
  // loading libsass.worker (subsequently loading libsass.js and sass.js inside the worker)
  Sass.initialize('dist/worker.min.js');
  var scss = '$someVar: 123px; .some-selector { width: $someVar; }';
  Sass.compile(scss, function(css) {
      console.log(css);
  });
</script>
```

### loading from `src/`

You can - for debugging purposes - load Sass.js from src files. Emscripten litters the global scope with ~400 variables, so this should never be used in production!

```html
<script src="src/libsass.js"></script>
<script src="src/sass.js"></script>
<script>
  var scss = '$someVar: 123px; .some-selector { width: $someVar; }';
  var css = Sass.compile(scss);
  console.log(css);
</script>
```

## Using the Sass.js API

```js
// compile text to SCSS
Sass.compile(text);
// set compile style options
Sass.options({
  // format output: nested, expanded, compact, compressed
  style: Sass.style.nested, 
  // add line comments to output: none, default
  comments: Sass.comments.none
});
// register a file to be available for @import
Sass.writeFile(filename, text);
// remove a file 
Sass.removeFile(filename);
// get a file's content
Sass.readFile(filename);
// list all files (regardless of directory structure)
Sass.listFiles();
```

### Working With Files

Chances are you want to use one of the readily available Sass mixins (e.g. [drublic/sass-mixins](https://github.com/drublic/Sass-Mixins) or [Bourbon](https://github.com/thoughtbot/bourbon)). While Sass.js doesn't feature a full-blown "loadBurbon()", registering files is possible:

```js
Sass.writeFile('one.scss', '.one { width: 123px; }');
Sass.writeFile('some-dir/two.scss', '.two { width: 123px; }');
Sass.compile('@import "one"; @import "some-dir/two";');
```

outputs

```css
.one {
  width: 123px; }

.two {
  width: 123px; }
```

---

## Changelog

### 0.2.0 (January 16th 2014) ###

* using libsass at v1.0.1 (instead of building from master)
* adding `grunt build` to generate `dist` files
* adding mocha tests `grunt test`

### 0.1.0 (January 13th 2014) ###

* Initial Sass.js

## Authors

* [Christian Kruse](https://github.com/ckruse) - [@cjk101010](https://twitter.com/cjk101010)
* [Sebastian Golasch](https://github.com/asciidisco) - [@asciidisco](https://twitter.com/asciidisco)
* [Rodney Rehm](http://rodneyrehm.de/en/) - [@rodneyrehm](https://twitter.com/rodneyrehm)


## License

Sass.js is - as [libsass](https://github.com/hcatlin/libsass) and [Emscripten](https://github.com/kripken/emscripten/) are - published under the [MIT License](http://opensource.org/licenses/mit-license).
