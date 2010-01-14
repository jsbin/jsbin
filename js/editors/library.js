//= require "libraries"
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
}).trigger('init');

$('#library').bind('change', function () {
  var libIndex = [],
      lib = {},
      state = {},
      re,
      i,
      code = editors.html.getCode();

  // strip existing libraries out  
  code = code.replace(/<script class="jsbin".*><\/script>\n?/g, '');
  code = code.replace(/<link class="jsbin".*><\/link>\n?/g, '');
  
  if (this.value != 'none') {
    // to restore
    state = {
      line: editors.html.currentLine(),
      character: editors.html.cursorPosition().character
    };

    libIndex = this.value.split('-');
    lib = libraries[libIndex[0]];

    // all has to happen in reverse order because we're going directly after <head>
    code = code.replace('<head', "<head>\n<" + 'script class="jsbin" src="' + lib.scripts[libIndex[1]].url + '"><' + '/script');
    if (lib.requires) {
      code = code.replace('<head', "<head>\n<" + 'script class="jsbin" src="' + lib.requires + '"><' + '/script');
    }
    
    if (lib.style) {
      code = code.replace('<head', "<head>\n<" + 'link class="jsbin" href="' + lib.style + '" rel="stylesheet" type="text/css"><' + '/link');
    }
  }

  editors.html.setCode(code);
  editors.html.focus();
  editors.html.selectLines(editors.html.nthLine(state.line), state.character);
});