// This is a zero-configuration add-on to [Brocco][] which adds support for
// documenting HTML and CSS files.
//
// The process for doing this is non-trivial, since both file
// types can only contain multi-line comments, which Brocco
// doesn't support by default. Furthermore, HTML files can
// contain inline CSS and JavaScript, each of which have their
// own commenting styles.
//
// We leverage [CodeMirror][] to do most of the heavy lifting
// for us.
//
//   [Brocco]: ?brocco.js
//   [CodeMirror]: http://codemirror.net/

(function() {
  var START_COMMENT_REGEXP = /^(\<\!--|\/\*|\/\/)(\s?)(.*)/;
  var START_COMMENT_MODES = {
    '<!--': 'html',
    '/*': 'cmultiline',
    '//': 'csingleline'
  };
  var END_COMMENT_REGEXPS = {
    'html': /(.*)--\>$/,
    'cmultiline': /(.*)\*\/$/
  };
  
  if (typeof(CodeMirror) == "undefined")
    return;

  Brocco.addLanguages({
    '.html': {
      name : "htmlmixed",
      symbol : "",
      makeSections: makeMixedHtmlSections
    },
    '.css': {
      name : "css",
      symbol : "",
      makeSections: makeMixedHtmlSections
    }
  });

  // This is the primary function that takes source code and
  // calls the given callback with a list of section objects
  // containing raw documentation (in the `docsText` key) and 
  // highlighted code (in the `codeHtml` key).
  //
  // The code is ultimately based on CodeMirror's [runmode][].
  //
  //   [runmode]: http://codemirror.net/demo/runmode.html
  function makeMixedHtmlSections(source, code, config, cb) {
    var mode = CodeMirror.getMode(CodeMirror.defaults, {
      name: this.name
    });

    // `commentMode` keeps track of whether we're currently
    // in a comment. `null` means we're not, while a string
    // indicates the particular type of comment we're in.
    var commentMode = null;
    
    // `commentIndent` is the number of spaces that we want to
    // un-indent multi-line comments so that our documentation
    // doesn't have a bunch of leading whitespace.
    var commentIndent = 0;
    var sections = [];
    var section = {};
    var match;
    var esc = Brocco.htmlEscape;
    var accum = [], col = 0;
    var finishSection = function() {
      if (!section.docsText)
        section.docsText = "";
      section.codeHtml = "<pre>" + accum.join("") + "</pre>";
      sections.push(section);
      section = {};
      accum = [];
    };
    var onText = function(text, style) {
      if (text == "\n") {
        accum.push("\n");
        col = 0;
        return;
      }
      if (commentMode == 'csingleline' && accum.length &&
          style == "comment") {
        match = text.match(START_COMMENT_REGEXP);
        if (match[1] == '//')
          text = match[3];
        else {
          // This code is only reached when we've reached a
          // multi-line comment in JavaScript code that immediately
          // follows a single-line comment.
          commentMode = null;
          section.docsText = accum.join("");
          accum = [];
        }
      }
      if (!commentMode && style == "comment") {
        match = text.match(START_COMMENT_REGEXP);
        if (match) {
          // When we reach our first non-contiguous comment line,
          // we finish the section we're on and start a new one.
          // The comment line we're on forms the first line of a
          // new section's documentation.
          commentMode = START_COMMENT_MODES[match[1]];
          commentIndent = col + match[1].length;
          if (match[2]) commentIndent += match[2].length;
          finishSection();
          text = match[3];
        }
      }
      if (commentMode == 'csingleline' && style != 'comment') {
        // This code is reached when we've been following a series
        // of single-line JavaScript comments and hit our first
        // non-comment. When this happens, we know we're done with
        // the documentation for the current section.
        commentMode = null;
        section.docsText = accum.join("");
        accum = [];
      }
      if (commentMode) {
        if (commentMode == "html" && style === null && col == 0)
          // CodeMirror's HTML mode doesn't actually highlight the leading
          // whitespace of a HTML-style comment line as part of a comment,
          // so we need to deal with it specially.
          text = text.slice(commentIndent);
        if (style == "comment") {
          if (commentMode == 'cmultiline' && col == 0 &&
              accum.length && text.trim() != '*/' &&
              text.slice(0, commentIndent).match(/^[\s*]+$/))
            // We want to strip out leading whitespace in multi-line
            // CSS/JS comments. We'll also treat asterisks as white-space
            // here, since we want to get rid of them when converting
            // comments like this into documentation:
            //
            //     /* This is a multi-line comment
            //      * with asterisks at the beginning of each line
            //      * so it looks pretty in a text editor.
            //      */
            text = text.slice(commentIndent);
          if (commentMode in END_COMMENT_REGEXPS) {
            // When we've reached the end of a multi-line comment,
            // we're done with the documentation for this section.
            match = text.match(END_COMMENT_REGEXPS[commentMode]);
            if (match) {
              commentMode = null;
              accum.push(match[1]);
              section.docsText = accum.join("");
              accum = [];
              col += text.length;
              return;
            }
          }
        }
      } else {
        col += text.length;
        if (Brocco.codeMirrorStyleMap[style])
          style = Brocco.codeMirrorStyleMap[style] + " cm-" + style;
        else
          style = "cm-" + style;
        accum.push("<span class=\"" + esc(style) +
                   "\">" + esc(text) + "</span>");
        return;
      }
      col += text.length;
      accum.push(text);
    };
  
    var lines = CodeMirror.splitLines(code),
        state = CodeMirror.startState(mode);
    for (var i = 0, e = lines.length; i < e; ++i) {
      if (i) onText("\n");
      var stream = new CodeMirror.StringStream(lines[i]);
      while (!stream.eol()) {
        var style = mode.token(stream, state);
        onText(stream.current(), style, i, stream.start);
        stream.start = stream.pos;
      }
    }
  
    if (accum.length || section.docsText)
      finishSection();
    
    cb(sections);
  }
})();
