exports.command = function(selector, callback) {
    var data = this.globals;
    var processor = '#processor-' + selector
    var css = ['css','less','myth','stylus','convert-css'];
    var js = ['javascript','babel','jsx','coffeescript','traceur','typescript','processing','livescript','convert'];
    var processorHref;
    var lang;
    for(var p in css) {
        if(selector === css[p]){
            processorHref = 'a[href="#cssprocessors"]'
            lang = '.css'
        }
    }
        for(var j in js) {
        if(selector === js[j]){
            processorHref = 'a[href="#javascriptprocessors"]'
            lang = '.javascript'
        }
    }

    this
      .waitForElementVisible(lang +' .CodeMirror')
      .click(processorHref)
      .click(processor).pause(data.defaultTime)
  return this; // allows the command to be chained.
};
