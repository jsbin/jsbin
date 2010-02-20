//= require "../chrome/storage"

// shortcut method
var push = Array.prototype.push;

var Libraries = function () {
  this.init();

  this.userSpecified = JSON.parse(localStorage.getItem('libraries') || "[]");
  
  // read from storage
  for (i = 0; i < this.userSpecified.length; i++) {
    push.call(this, this.userSpecified[i]);
  }
};

Libraries.prototype.init = function () {
  var libs = {
    yui: {
      text: 'YUI',
      scripts: [
        { text: 'YUI 2.8.0r4', url: 'http://ajax.googleapis.com/ajax/libs/yui/2.8.0r4/build/yuiloader/yuiloader-min.js'},
        { text: 'YUI 2.7.0', url: 'http://ajax.googleapis.com/ajax/libs/yui/2.7.0/build/yuiloader/yuiloader-min.js' }
      ]
    },
    mootools: {
      text: 'MooTools',
      scripts: [
        { text: 'Mootools 1.2.4', url: 'http://ajax.googleapis.com/ajax/libs/mootools/1.2.4/mootools-yui-compressed.js' },
        { text: 'Mootools 1.2.3', url: 'http://ajax.googleapis.com/ajax/libs/mootools/1.2.3/mootools-yui-compressed.js'}
      ]
    },
    prototype: {
      text: 'Prototype',
      scripts: [
        { text: 'Prototype latest', url: 'http://ajax.googleapis.com/ajax/libs/prototype/1/prototype.js' },
        { text: 'Prototype 1.6.1.0', url: 'http://ajax.googleapis.com/ajax/libs/prototype/1.6.1.0/prototype.js' },
        { text: 'Prototype 1.6.0.3', url: 'http://ajax.googleapis.com/ajax/libs/prototype/1.6.0.3/prototype.js'}
      ]
    },
    jquery: {
      text: 'jQuery',
      scripts: [
        { text: 'jQuery latest', url: 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js' },
        { text: 'jQuery 1.4.2', url: 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js' },
        { text: 'jQuery 1.4.0', url: 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js' },
        { text: 'jQuery 1.3.2', url: 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js' },
        { text: 'jQuery 1.2.6', url: 'http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.min.js' }
      ]
    },
    jqueryui : {
      text: 'jQuery UI',
      requires: 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',
      style: 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/themes/base/jquery-ui.css',
      scripts: [
        { text: 'jQuery UI 1.7.2', url: 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js' }
        // { text: 'jQuery UI 1.6', url: 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.6/jquery-ui.min.js' }
      ]
    },
    scriptaculous: {
      text: 'script.aculo.us',
      requires: 'http://ajax.googleapis.com/ajax/libs/prototype/1/prototype.js',
      scripts: [
        { text: 'script.aculo.us 1.8.3', url: 'http://ajax.googleapis.com/ajax/libs/scriptaculous/1.8.3/scriptaculous.js' }
      ]
    },
    dojo : {
      text: 'Dojo',
      scripts: [
        { text: 'Dojo 1.4.1', url: 'http://ajax.googleapis.com/ajax/libs/dojo/1.4.1/dojo/dojo.xd.js' },
        { text: 'Dojo 1.3.2', url: 'http://ajax.googleapis.com/ajax/libs/dojo/1.3.2/dojo/dojo.xd.js' }
      ]
    },
    ext : {
      text: 'Ext Core',
      style: 'http://extjs.cachefly.net/ext-2.2/resources/css/ext-all.css',
      scripts: [
        { text: 'Ext Core 3.1', url: 'http://ajax.googleapis.com/ajax/libs/ext-core/3.1.0/ext-core.js' }
      ]
    }
  },
  order = 'jquery jqueryui prototype scriptaculous yui mootools dojo ext'.split(' '),
  i = 0;
  
  this.length = 0; // triggers support for length prop
  for (i = 0; i < order.length; i++) {
    push.call(this, libs[order[i]]);
  }
};

Libraries.prototype.add = function (lib) {
  // save to localStorage
  this.userSpecified.push(lib);
  try {
    localStorage.setItem('libraries', JSON.stringify(this.userSpecified));
  } catch (e) {} // just in case of DOM_22 error, makes me so sad to use this :(
  push.call(this, lib);
  $('#library').trigger('init');
};

Libraries.prototype.clear = function () {
  this.userSpecified = [];
  localStorage.removeItem('libraries');
  this.init();
  $('#library').trigger('init');
};

// OO based to all me to fiddle the object to resemble an array
var libraries = new Libraries();
window.libraries = libraries; // expose a command line API