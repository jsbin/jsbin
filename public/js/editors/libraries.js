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
        "url": "http://code.jquery.com/jquery-2.0.0b2.js",
        "label": "jQuery 2.0 beta 2",
        "group": "jQuery"
    },
    {
        "url": "http://code.jquery.com/jquery-1.9.1.min.js",
        "label": "jQuery 1.9.1",
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
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1/themes/smoothness/jquery-ui.css",
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
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/themes/smoothness/jquery-ui.css",
            "http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js",
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js"
        ],
        "label": "jQuery UI 1.10.2",
        "group": "jQuery UI"
    },
    {
        "url": [
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/themes/smoothness/jquery-ui.css",
            "http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js",
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"
        ],
        "label": "jQuery UI 1.9.2",
        "group": "jQuery UI"
    },
    {
        "url": [
            "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.24/themes/smoothness/jquery-ui.css",
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
            "http://twitter.github.io/bootstrap/assets/css/bootstrap.css",
            "http://twitter.github.io/bootstrap/assets/css/bootstrap-responsive.css",
            "http://twitter.github.io/bootstrap/assets/js/bootstrap.js"
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
        "url": "http://yui.yahooapis.com/3.10.0/build/yui/yui.js",
        "label": "YUI 3.10.0",
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
            "http://cdn.kendostatic.com/2013.1.319/styles/kendo.common.min.css",
            "http://cdn.kendostatic.com/2013.1.319/styles/kendo.rtl.min.css",
            "http://cdn.kendostatic.com/2013.1.319/styles/kendo.default.min.css",
            "http://cdn.kendostatic.com/2013.1.319/styles/kendo.dataviz.min.css",
            "http://cdn.kendostatic.com/2013.1.319/styles/kendo.dataviz.default.min.css",
            "http://cdn.kendostatic.com/2013.1.319/styles/kendo.mobile.all.min.css",
            "http://code.jquery.com/jquery-1.9.1.min.js",
            "http://cdn.kendostatic.com/2013.1.319/js/kendo.all.min.js"
        ],
        "label": "Kendo UI Q1 2013",
        "group": "Kendo UI"
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
        "url" : [
            "http://code.jquery.com/qunit/qunit-git.css",
            "http://code.jquery.com/qunit/qunit-git.js"
        ],
        "label": "QUnit",
        "group": "Testing"
    },
    {
        "url": "http://zeptojs.com/zepto.min.js",
        "label": "Zepto latest",
        "group": "Zepto"
    },
    {
        "url": "http://cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min.js",
        "label": "Zepto 1.0",
        "group": "Zepto"
    },
    {
        "url":"http://ajax.googleapis.com/ajax/libs/angularjs/1.1.3/angular.min.js",
        "label": "Angular 1.1.3 Unstable",
        "group": "Angular"
    },
    {
        "url":"http://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min.js",
        "label": "Angular 1.0.5 Stable",
        "group": "Angular"
    },
    {
        "url": [
            "http://nightly.enyojs.com/latest/enyo-nightly/enyo.css",
            "http://nightly.enyojs.com/latest/enyo-nightly/enyo.js",
            "http://nightly.enyojs.com/latest/lib/layout/package.js",
            "http://nightly.enyojs.com/latest/lib/onyx/package.js",
            "http://nightly.enyojs.com/latest/lib/g11n/package.js",
            "http://nightly.enyojs.com/latest/lib/canvas/package.js"
        ],
        "label": "Enyo latest",
        "group": "Enyo"
    },
    {
        "url": [
            "http://enyojs.com/enyo-2.2.0/enyo.css",
            "http://enyojs.com/enyo-2.2.0/enyo.js",
            "http://enyojs.com/enyo-2.2.0/lib/layout/package.js",
            "http://enyojs.com/enyo-2.2.0/lib/onyx/package.js",
            "http://enyojs.com/enyo-2.2.0/lib/g11n/package.js",
            "http://enyojs.com/enyo-2.2.0/lib/canvas/package.js"
        ],
        "label": "Enyo 2.2.0",
        "group": "Enyo"
    },
    {
        "url": [
            "http://documentcloud.github.io/underscore/underscore-min.js",
            "http://documentcloud.github.io/backbone/backbone-min.js"
        ],
        "label": "Backbone latest"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/bonsai/0.4/bonsai.min.js",
        "label": "Bonsai 0.4.latest"
    },
    {
        "url": "http://jashkenas.github.io/coffee-script/extras/coffee-script.js",
        "label": "CoffeeScript"
    },
    {
        "url": [
            "http://code.jquery.com/jquery.js",
            "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0-rc.3/handlebars.js",
            "//cdnjs.cloudflare.com/ajax/libs/ember.js/1.0.0-rc.3/ember.js"
        ],
        "label": "Ember.js 1.0.0-rc.3"
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
        "url": [
            "http://cdnjs.cloudflare.com/ajax/libs/foundation/4.1.2/css/normalize.min.css",
            "http://cdnjs.cloudflare.com/ajax/libs/foundation/4.1.2/css/foundation.min.css",
            "http://cdnjs.cloudflare.com/ajax/libs/foundation/4.1.2/js/vendor/custom.modernizr.min.js",
            "http://cdnjs.cloudflare.com/ajax/libs/foundation/4.1.2/js/vendor/jquery.min.js",
            "http://cdnjs.cloudflare.com/ajax/libs/foundation/4.1.2/js/foundation.min.js"
        ],
        "label": "Foundation 4.1.2"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0-rc.3/handlebars.js",
        "label": "Handlebars.js 1.0.0-rc.3"
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
        "url": "http://remy.github.io/twitterlib/twitterlib.min.js",
        "label": "TwitterLib"
    },
    {
        "url": "http://documentcloud.github.io/underscore/underscore-min.js",
        "label": "underscore latest"
    },
    {
        "url":[
            "http://code.jquery.com/jquery-1.9.1.min.js",
            " http://canjs.us/release/latest/can.jquery.js"
        ],
        "label": "CanJS for jQuery"
    },
    {
        "url":[
            "http://cdnjs.cloudflare.com/ajax/libs/three.js/r55/three.min.js"
        ],
        "label": "Three.js"
    },
    {
        "url":[
            "http://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.6.2/html5shiv.js"
        ],
        "label": "HTML5 shiv"
    },
    {
        "url": [
            "http://vjs.zencdn.net/4.0/video-js.css",
            "http://vjs.zencdn.net/4.0/video.js"
        ],
        "label": "Video.js"
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
