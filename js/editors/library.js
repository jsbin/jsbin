//= require "libraries"
var state = {};
$('#library').bind('init', function () {
  var $select = $(this),
      html = ['<option value="none">None</option>'],
      selected = $select.val(),
      i, j;
  
  for (i = 0; i < libraries.length; i++) {
    html.push('<optgroup label="' + libraries[i].text + '">');
    for (j = 0; j < libraries[i].scripts.length; j++) {
      html.push('<option value="' + i + '-' + j + '">' + libraries[i].scripts[j].text + '</option>');
    }
    html.push('</optgroup>');
  }
  
  $select.html( html.join('') ).val(selected);
}).trigger('init').change(function () {
  var libIndex = [],
      lib = {},
      thislib = {},
      i,
      code = editors.html.getCode();

  // strip existing libraries out  
  var addAdjust = code.match(/<(script|link) class="jsbin"/g);
  if (addAdjust == null) addAdjust = [];
  
  code = code.replace(/<script class="jsbin".*><\/script>\n?/g, '');
  code = code.replace(/<link class="jsbin".*\/>\n?/g, '');
  
  if (this.value != 'none') {
    // to restore (note - the adjustment isn't quite 100% right yet)
    state = {
      line: editors.html.currentLine(),
      character: editors.html.getCursor().ch,
      add: 1 - addAdjust.length
    };

    libIndex = this.value.split('-');
    lib = libraries[libIndex[0]];
    thislib = lib.scripts[libIndex[1]];

    if (thislib.requires) lib.requires = thislib.requires;
    if (thislib.style) lib.style = thislib.style;

    // all has to happen in reverse order because we're going directly after <head>
    if (code.indexOf('<head') !== -1) {
      code = code.replace('<head', "<head>\n<" + 'script class="jsbin" src="' + lib.scripts[libIndex[1]].url + '"><' + '/script');
      if (lib.requires) {
        state.add++;
        code = code.replace('<head', "<head>\n<" + 'script class="jsbin" src="' + lib.requires + '"><' + '/script');
      }
      
      if (lib.style) {
        if (typeof lib.style === 'string') lib.style = [lib.style];
        for (i = 0; i < lib.style.length; i++) {
          state.add++;
          code = code.replace('<head', "<head>\n<" + 'link class="jsbin" href="' + lib.style[i] + '" rel="stylesheet" type="text/css" /');
        }
      }
    } else { // add to the start of the doc
      code = "<" + 'script class="jsbin" src="' + lib.scripts[libIndex[1]].url + '"><' + '/script>\n' + code;
      if (lib.requires) {
        state.add++;
        code = "<" + 'script class="jsbin" src="' + lib.requires + '"><' + '/script>\n' + code;
      }
      
      if (lib.style) {
        state.add++;
        code = '<' + 'link class="jsbin" href="' + lib.style + '" rel="stylesheet" type="text/css" />\n' + code;
      }
    }

    state.line += state.add;
  } else {
    state.line -= state.add;
  }

  editors.html.setCode(code);
  editors.html.focus();
  editors.html.setCursor({ line: state.line, ch: state.character });
});