(function () {
  'use strict';
  /*globals $, jsbin, CodeMirror, template, ternDefinitions, ternBasicDefs */

  if (jsbin.embed) {
    return;
  }

  var ternServer;
  var ternLoaded = {};

  var initTern = function(editor, defs){
    var keyMap = {
      'Ctrl-Q': function(cm) { ternServer.selectName(cm); },
      'Ctrl-I': function(cm) { ternServer.showType(cm); },
      'Ctrl-Space': function(cm) { ternServer.complete(cm); }
    };
    if (typeof defs === 'undefined') {
      defs = [];
    }
    ternServer = new CodeMirror.TernServer({
      defs: defs,
      useWorker: false,
      cm: editor
    });
    editor.addKeyMap(keyMap);
    editor.on('cursorActivity', function(cm) { ternServer.updateArgHints(cm); });
  };

  var addTernDefinition = function(def) {
    if (typeof ternServer === 'object') {
      ternServer.options.defs.push(def);
      ternServer = new CodeMirror.TernServer({
        defs: ternServer.options.defs,
        useWorker: ternServer.options.useWorker,
        tooltipType: ternServer.options.tooltipType,
        cm: ternServer.options.cm
      });
    }
  };

  // Load the json defition of the library
  var loadTernDefinition = function(name, file) {
    if (!ternLoaded[name]) {
      $.ajax({
        url: file,
        dataType: 'json',
        success: function(data) {
          addTernDefinition(data);
          ternLoaded[name] = true;
        }
      });
    }
  };

  // Load the actual js library
  var loadTernFile = function(name, file) {
    if (!ternLoaded[name]) {
      $.ajax({
        url: file,
        dataType: 'script',
        success: function(data) {
          ternServer.server.addFile(name, data);
          ternLoaded[name] = true;
        }
      });
    }
  };

  var loadTern = function(editor) {
    initTern(editor, ternBasicDefs);
    ternLoaded.ecma5 = true;
    ternLoaded.browser = true;
  };

  var searchTernDefinition = function(htmlCode) {
    for (var i = 0; i < ternDefinitions.length; i++) {
      if (ternDefinitions[i].match.test(htmlCode)) {
        if (ternDefinitions[i].type === 'def') {
          loadTernDefinition(ternDefinitions[i].name, ternDefinitions[i].file);
        } else {
          loadTernFile(ternDefinitions[i].name, ternDefinitions[i].file);
        }
      }
    }
  };

  // Overwrite the autocomplete function to use tern
  CodeMirror.commands.autocomplete = function(cm) {
    if (CodeMirror.snippets(cm) === CodeMirror.Pass) {
      var pos = cm.getCursor();
      var tok = cm.getTokenAt(pos);
      var indent = '';
      if (cm.options.indentWithTabs) {
        indent = '\t';
      } else {
        indent = new Array(cm.options.indentUnit * 1 + 1).join(' ');
      }

      // I don't like this - feel like we shouldnt be pseudo parsing the code around the cursor. - FO
      // the && here is in the correct place, if the token type is null, but the token string is '.'
      // then we're probably at the end of an object lookup so let's use tern for autocomplete
      if (tok.string === ';' || tok.type === 'string' || tok.type === null && tok.string !== '.') {
        return cm.replaceRange(indent, pos);
      }
      if (tok.string.trim() !== '') {
        return ternServer.complete(cm);
      }
      return cm.replaceRange(indent, pos);
    }
  };

  CodeMirror.startTern = function() {
    loadTern(jsbin.panels.panels.javascript.editor);
    searchTernDefinition(jsbin.panels.panels.html.getCode());

    $('#library').bind('change', function () {
      searchTernDefinition(jsbin.panels.panels.html.getCode());
    });
  };

})();
