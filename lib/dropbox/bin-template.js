(function (root) {
  'use strict';

  var KEYS = ['html', 'css', 'javascript'];

  function panelTypesForBin (bin) {
    var processors = bin.settings.processors || {};

    return function panelType(type) {
      return processors[type] || type;
    };

  }

  function outputForBinFactory (bin) {
    var processors = bin.settings.processors || {};

    return function outputForBin (type) {
      if (!processors[type]) {
        return bin[type];
      } else {
        // TODO: Actually wanna chuck it through preprocessor;
        return bin[type];
      }
    };

  }

  // Basic wrapper for KEYS.reduce(fn, {});
  function reduceKeys (fn) {
    return KEYS.reduce(function(o, i){
      fn.call(null, o, i);
      return o;
    }, {});
  }

  function createOutputObjectForBin (bin) {
    var outputForBin = outputForBinFactory(bin);
    return reduceKeys(function(obj, key) {
      obj[key] = outputForBin(key);
    });
  }

  function createPanelsObjectForBin (bin) {
    var panelType = panelTypesForBin(bin);

    return reduceKeys(function(obj, key) {
      /*
      obj.html = {
        type: panelType('html'),
        content: bin.html
      }
      */
      obj[key] = {
        type: panelType(key),
        content: bin[key]
      };
    });

  }

  function makeHTML() {

  }

  function templateFromBin (bin) {

    var templateData = {
      output: createOutputObjectForBin(bin),
      panels: createPanelsObjectForBin(bin)
    };

    makeHTML(templateData);

  }

  root.templateFromBin = templateFromBin;

}(module && module.exports || window));
