//= require "../chrome/storage"

var libraries = [
    {
        "url": "http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js",
        "label": "jQuery latest",
        "group": "jQuery"
    },
    {
        "url": "http://code.jquery.com/jquery-git.js",
        "label": "jQuery WIP (via git)",
        "group": "jQuery"
    },
    {
        "url": "http://code.jquery.com/jquery-1.7.1.min.js",
        "label": "jQuery 1.7.1",
        "group": "jQuery"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js",
        "label": "jQuery 1.6.4",
        "group": "jQuery"
    },
    {
        "url": [
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1/themes/base/jquery-ui.css",
            "http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js",
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.13/jquery-ui.min.js"
        ],
        "label": "jQuery UI 1.8.13",
        "group": "jQuery UI"
    },
    {
        "url": [
            "http://code.jquery.com/mobile/latest/jquery.mobile.css",
            "http://code.jquery.com/jquery-1.6.4.min.js",
            "http://code.jquery.com/mobile/latest/jquery.mobile.js"
        ],
        "label": "jQuery Mobile Latest",
        "group": "jQuery Mobile"
    },
    {
        "url": [
            "http://code.jquery.com/mobile/latest/jquery.mobile.css",
            "http://code.jquery.com/jquery-1.6.4.min.js",
            "http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.1.min.js"
        ],
        "label": "jQuery Mobile 1.0.1",
        "group": "jQuery Mobile"
    },
    {
        "url": [
            "http://code.jquery.com/mobile/latest/jquery.mobile.css",
            "http://code.jquery.com/jquery-1.6.4.min.js",
            "http://code.jquery.com/mobile/1.1.0-rc.1/jquery.mobile-1.1.0-rc.1.js"
        ],
        "label": "jQuery Mobile 1.1.0rc1",
        "group": "jQuery Mobile"
    },
    {
        "url": [
            "http://code.jquery.com/jquery.min.js",
            "http://twitter.github.com/bootstrap/assets/css/bootstrap.css",
            "http://twitter.github.com/bootstrap/assets/css/bootstrap-responsive.css",
            "http://twitter.github.com/bootstrap/assets/js/bootstrap.js"
        ],
        "label": "Bootstrap latest",
        "group": "Bootstrap"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/prototype/1/prototype.js",
        "label": "Prototype latest",
        "group": "Prototype"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype.js",
        "label": "Prototype 1.7.0.0",
        "group": "Prototype"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/prototype/1.6.1.0/prototype.js",
        "label": "Prototype 1.6.1.0",
        "group": "Prototype"
    },
    {
        "url": [
            "http://ajax.googleapis.com/ajax/libs/prototype/1/prototype.js",
            "http://ajax.googleapis.com/ajax/libs/scriptaculous/1.8.3/scriptaculous.js"
        ],
        "label": "script.aculo.us 1.8.3",
        "group": "Prototype"
    },
    {
        "url": "http://yui.yahooapis.com/3.3.0/build/yui/yui-min.js",
        "label": "YUI 3.3.0",
        "group": "YUI"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/yui/2.8.2/build/yuiloader/yuiloader-min.js",
        "label": "YUI 2.8.2",
        "group": "YUI"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/mootools/1.3.2/mootools-yui-compressed.js",
        "label": "Mootools 1.3.2",
        "group": "MooTools"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/mootools/1.2.4/mootools-yui-compressed.js",
        "label": "Mootools 1.2.4",
        "group": "MooTools"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/dojo/1.6.0/dojo/dojo.xd.js",
        "label": "Dojo 1.6.0",
        "group": "Dojo"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/dojo/1.4.1/dojo/dojo.xd.js",
        "label": "Dojo 1.4.1",
        "group": "Dojo"
    },
    {
        "url": [
            "http://documentcloud.github.com/underscore/underscore-min.js",
            "http://documentcloud.github.com/backbone/backbone-min.js"
        ],
        "label": "Backbone 0.9.1"
    },
    {
        "url": "http://jashkenas.github.com/coffee-script/extras/coffee-script.js",
        "label": "CoffeeScript"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/es5-shim/1.2.4/es5-shim.min.js",
        "label": "ES5 shim 1.2.4"
    },
    {
        "url": [
            "http://extjs.cachefly.net/ext-3.1.0/resources/css/ext-all.css",
            "http://cdnjs.cloudflare.com/ajax/libs/ext-core/3.1.0/ext-core.js"
        ],
        "label": "ext-core 3.1.0"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/less.js/1.1.3/less-1.1.3.min.js",
        "label": "Less 1.1.3"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.5.3/modernizr.min.js",
        "label": "Modernizr 2.5.3"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/processing.js/1.2.3/processing-api.min.js",
        "label": "Processing 1.2.3"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/raphael/2.0.0/raphael-min.js",
        "label": "Rapha&euml;l 2.0.0"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/sammy.js/0.6.3/sammy.min.js",
        "label": "Sammy 0.6.3"
    },
    {
        "url": [
            "http://cdn.sencha.io/touch/1.1.0/resources/css/sencha-touch.css",
            "http://cdn.sencha.io/touch/1.1.0/sencha-touch.js"
        ],
        "label": "Sencha Touch"
    },
    {
        "url": [
            "http://traceur-compiler.googlecode.com/git/src/traceur.js",
            "http://traceur-compiler.googlecode.com/git/src/bootstrap.js"
        ],
        "label": "Traceur"
    },
    {
        "url": "http://remy.github.com/twitterlib/twitterlib.min.js",
        "label": "TwitterLib"
    },
    {
        "url": "http://documentcloud.github.com/underscore/underscore-min.js",
        "label": "underscore 1.3.1"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/zepto/0.7/zepto.min.js",
        "label": "Zepto 0.7"
    }
];

window.libraries = libraries; // expose a command line API

libraries.userSpecified = JSON.parse(localStorage.getItem('libraries') || "[]");
for (var i = 0; i < libraries.userSpecified.length; i++) {
  libraries.push(libraries.userSpecified[i]);
}

libraries.add = function (lib) {
  // save to localStorage
  lib.group = 'Custom';
  this.userSpecified.push(lib);
  try {
    localStorage.setItem('libraries', JSON.stringify(this.userSpecified));
  } catch (e) {} // just in case of DOM_22 error, makes me so sad to use this :(
  libraries.push(lib);
  $('#library').trigger('init');
};

libraries.clear = function () {
  libraries.userSpecified = [];
  localStorage.removeItem('libraries');
  var length = libraries.length;
  for (var i = 0; i < length; i++) {
    if (libraries[i].group === 'Custom') {
      libraries.splice(i, 1);
      length--;
    }
  }
  // force a refresh?
  $('#library').trigger('init');
};