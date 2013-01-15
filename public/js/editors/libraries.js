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
        "url": "http://code.jquery.com/jquery-1.9.0.min.js",
        "label": "jQuery 1.9.0",
        "group": "jQuery"
    },
    {
        "url": "http://code.jquery.com/jquery-1.8.3.min.js",
        "label": "jQuery 1.8.3",
        "group": "jQuery"
    },
    {
        "url": "http://code.jquery.com/jquery-1.7.2.min.js",
        "label": "jQuery 1.7.2",
        "group": "jQuery"
    },
    {
        "url": [
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1/themes/base/jquery-ui.css",
            "http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js",
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"
        ],
        "label": "jQuery UI latest",
        "group": "jQuery UI"
    },
    {
        "url": [
            "http://code.jquery.com/ui/jquery-ui-git.css",
            "http://code.jquery.com/jquery-git.js",
            "http://code.jquery.com/ui/jquery-ui-git.js"
        ],
        "label": "jQuery UI WIP (via git)",
        "group": "jQuery UI"
    },
    {
        "url": [
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/themes/base/jquery-ui.css",
            "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js",
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"
        ],
        "label": "jQuery UI 1.9.1",
        "group": "jQuery UI"
    },
    {
        "url": [
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.24/themes/base/jquery-ui.css",
            "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js",
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.24/jquery-ui.min.js"
        ],
        "label": "jQuery UI 1.8.24",
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
            "http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.css",
            "http://code.jquery.com/jquery-1.8.2.min.js",
            "http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.js"
        ],
        "label": "jQuery Mobile 1.2.0",
        "group": "jQuery Mobile"
    },
    {
        "url": [
            "http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.css",
            "http://code.jquery.com/jquery-1.6.4.min.js",
            "http://code.jquery.com/mobile/1.1.1/jquery.mobile-1.1.1.min.js"
        ],
        "label": "jQuery Mobile 1.1.1",
        "group": "jQuery Mobile"
    },
    {
        "url": [
            "http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.min.css",
            "http://code.jquery.com/jquery-1.6.4.min.js",
            "http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.1.min.js"
        ],
        "label": "jQuery Mobile 1.0.1",
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
        "url": "http://ajax.googleapis.com/ajax/libs/prototype/1.7.1/prototype.js",
        "label": "Prototype 1.7.1",
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
        "url": "http://yui.yahooapis.com/3.8.0/build/yui/yui-min.js",
        "label": "YUI 3.8.0",
        "group": "YUI"
    },
    {
        "url": "http://yui.yahooapis.com/2.9.0/build/yuiloader/yuiloader-min.js",
        "label": "YUI 2.9.0",
        "group": "YUI"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js",
        "label": "MooTools 1.4.5",
        "group": "MooTools"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/mootools/1.3.2/mootools-yui-compressed.js",
        "label": "MooTools 1.3.2",
        "group": "MooTools"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/dojo/1.8.0/dojo/dojo.js",
        "label": "Dojo 1.8.0",
        "group": "Dojo"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/dojo/1.7.3/dojo/dojo.js",
        "label": "Dojo 1.7.3",
        "group": "Dojo"
    },
    {
        "url": "http://ajax.googleapis.com/ajax/libs/dojo/1.6.1/dojo/dojo.xd.js",
        "label": "Dojo 1.6.1",
        "group": "Dojo"
    },
    {
        "url": [
            "http://ajax.googleapis.com/ajax/libs/dojo/1.8.0/dijit/themes/claro/claro.css",
            "http://ajax.googleapis.com/ajax/libs/dojo/1.8.0/dojo/dojo.js"
        ],
        "label": "Dijit 1.8.0 (Claro)",
        "group": "Dojo"
    },
    {
        "url": [
            "http://ajax.googleapis.com/ajax/libs/dojo/1.7.3/dijit/themes/claro/claro.css",
            "http://ajax.googleapis.com/ajax/libs/dojo/1.7.3/dojo/dojo.js"
        ],
        "label": "Dijit 1.7.3 (Claro)",
        "group": "Dojo"
    },
    {
        "url": [
            "http://ajax.googleapis.com/ajax/libs/dojo/1.6.1/dijit/themes/claro/claro.css",
            "http://ajax.googleapis.com/ajax/libs/dojo/1.6.1/dojo/dojo.xd.js"
        ],
        "label": "Dijit 1.6.1 (Claro)",
        "group": "Dojo"
    },
    {
        "url": [
            "http://cdn.kendostatic.com/2012.3.1114/styles/kendo.common.min.css",
            "http://cdn.kendostatic.com/2012.3.1114/styles/kendo.rtl.min.css",
            "http://cdn.kendostatic.com/2012.3.1114/styles/kendo.default.min.css",
            "http://cdn.kendostatic.com/2012.3.1114/styles/kendo.dataviz.min.css",
            "http://cdn.kendostatic.com/2012.3.1114/styles/kendo.dataviz.default.min.css",
            "http://cdn.kendostatic.com/2012.3.1114/styles/kendo.mobile.all.min.css",
            "http://code.jquery.com/jquery-1.8.2.min.js",
            "http://cdn.kendostatic.com/2012.3.1114/js/kendo.all.min.js"
        ],
        "label": "Kendo UI Q3 2012",
        "group": "Kendo UI"
    },
    {
        "url": [
            "http://cdn.kendostatic.com/2012.2.710/styles/kendo.common.min.css",
            "http://cdn.kendostatic.com/2012.2.710/styles/kendo.default.min.css",
            "http://cdn.kendostatic.com/2012.2.710/styles/kendo.dataviz.min.css",
            "http://cdn.kendostatic.com/2012.2.710/styles/kendo.mobile.all.min.css",
            "http://code.jquery.com/jquery-1.7.2.min.js",
            "http://cdn.kendostatic.com/2012.2.710/js/kendo.all.min.js"
        ],
        "label": "Kendo UI Q2 2012",
        "group": "Kendo UI"
    },
    {
        "url" : [
            "http://code.jquery.com/qunit/qunit-git.css",
            "http://code.jquery.com/qunit/qunit-git.js"
        ],
        "label": "QUnit",
        "group": "Testing"
    },
    {
        "url":"http://cdnjs.cloudflare.com/ajax/libs/angular.js/1.0.3/angular.min.js",
        "label": "Angular 1.0.3"
    },
    {
        "url": [
            "http://documentcloud.github.com/underscore/underscore-min.js",
            "http://documentcloud.github.com/backbone/backbone-min.js"
        ],
        "label": "Backbone latest"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/bonsai/0.4/bonsai.min.js",
        "label": "Bonsai 0.4.latest"
    },
    {
        "url": "http://jashkenas.github.com/coffee-script/extras/coffee-script.js",
        "label": "CoffeeScript"
    },
    {
        "url": "https://github.com/downloads/emberjs/ember.js/ember-0.9.8.1.min.js",
        "label": "Ember.js 0.9.8.1"
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
        "url": "http://cdnjs.cloudflare.com/ajax/libs/knockout/2.2.0/knockout-min.js",
        "label": "Knockout 2.2"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/less.js/1.3.3/less.min.js",
        "label": "Less 1.3.3"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/lodash.js/0.5.2/lodash.min.js",
        "label": "lodash 0.5.2"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.5.3/modernizr.min.js",
        "label": "Modernizr 2.5.3"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.6/prefixfree.min.js",
        "label": "Prefixfree 1.0.6"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/processing.js/1.3.6/processing-api.min.js",
        "label": "Processing 1.3.6"
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
            jsbin.static + "/js/vendor/traceur.js"
        ],
        "label": "Traceur"
    },
    {
        "url": "http://remy.github.com/twitterlib/twitterlib.min.js",
        "label": "TwitterLib"
    },
    {
        "url": "http://documentcloud.github.com/underscore/underscore-min.js",
        "label": "underscore latest"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/zepto/1.0rc1/zepto.min.js",
        "label": "Zepto 1.0rc1"
    },
    {
        "url":[
            "http://code.jquery.com/jquery-1.7.1.min.js",
            " http://canjs.us/release/latest/can.jquery.js"
        ],
        "label": "CanJS for jQuery"
    }
];

window.libraries = libraries; // expose a command line API

libraries.userSpecified = JSON.parse(localStorage.getItem('libraries') || "[]");
for (var i = 0; i < libraries.userSpecified.length; i++) {
  libraries.push(libraries.userSpecified[i]);
}

libraries.add = function (lib) {
  // Extract each script from a list (as documented) or use the default way
  if (lib.scripts) {
    lib.scripts.forEach(function (script) {
      script.group = lib.text;
      script.label = script.text;
      this.userSpecified.push(script);
      libraries.push(script);
    }.bind(this));
  } else {
    // Adding a lib according to the above schema
    lib.group = 'Custom';
    this.userSpecified.push(lib);
    libraries.push(lib);
  }
  try {
    localStorage.setItem('libraries', JSON.stringify(this.userSpecified));
  } catch (e) {} // just in case of DOM_22 error, makes me so sad to use this :(
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
