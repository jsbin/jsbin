//= require "../chrome/storage"

var libraries = [
    {
        "url": "//ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js",
        "label": "jQuery 2.0.2",
        "group": "jQuery"
    },
    {
        "url": "//code.jquery.com/jquery-git.js",
        "label": "jQuery WIP (via git)",
        "group": "jQuery"
    },
    {
        "url": "//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js",
        "label": "jQuery 1.10.1",
        "group": "jQuery"
    },
    {
        "url": "//ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js",
        "label": "jQuery 1.8.3",
        "group": "jQuery"
    },
    {
        "url": [
            "//code.jquery.com/ui/jquery-ui-git.css",
            "//code.jquery.com/jquery-git.js",
            "//code.jquery.com/ui/jquery-ui-git.js"
        ],
        "label": "jQuery UI WIP (via git)",
        "group": "jQuery UI"
    },
    {
        "url": [
            "//ajax.googleapis.com/ajax/libs/jqueryui/1/themes/smoothness/jquery-ui.min.css",
            "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js",
            "//ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"
        ],
        "label": "jQuery UI latest",
        "group": "jQuery UI"
    },
    {
        "url": [
            "//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/smoothness/jquery-ui.min.css",
            "//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js",
            "//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"
        ],
        "label": "jQuery UI 1.10.3",
        "group": "jQuery UI"
    },
    {
        "url": [
            "//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/themes/smoothness/jquery-ui.min.css",
            "//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js",
            "//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"
        ],
        "label": "jQuery UI 1.9.2",
        "group": "jQuery UI"
    },
    {
        "url": [
            "//code.jquery.com/mobile/latest/jquery.mobile.css",
            "//code.jquery.com/jquery-1.9.1.min.js",
            "//code.jquery.com/mobile/latest/jquery.mobile.js"
        ],
        "label": "jQuery Mobile Latest",
        "group": "jQuery Mobile"
    },
    {
        "url": [
            "//code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.css",
            "//code.jquery.com/jquery-1.8.2.min.js",
            "//code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js"
        ],
        "label": "jQuery Mobile 1.3.1",
        "group": "jQuery Mobile"
    },
    {
        "url": [
            "//code.jquery.com/mobile/1.2.1/jquery.mobile-1.2.1.min.css",
            "//code.jquery.com/jquery-1.8.3.min.js",
            "//code.jquery.com/mobile/1.2.1/jquery.mobile-1.2.1.min.js"
        ],
        "label": "jQuery Mobile 1.2.1",
        "group": "jQuery Mobile"
    },
    {
        "url": [
            "//code.jquery.com/mobile/1.1.2/jquery.mobile-1.1.2.min.css",
            "//code.jquery.com/jquery-1.6.4.min.js",
            "//code.jquery.com/mobile/1.1.2/jquery.mobile-1.1.2.min.js"
        ],
        "label": "jQuery Mobile 1.1.2",
        "group": "jQuery Mobile"
    },
    {
    "url": [
            "//code.jquery.com/jquery.min.js",
            "//twitter.github.io/bootstrap/assets/css/bootstrap.css",
            "//twitter.github.io/bootstrap/assets/css/bootstrap-responsive.css",
            "//twitter.github.io/bootstrap/assets/js/bootstrap.js"
        ],
        "label": "Bootstrap latest",
        "group": "Bootstrap"
    },
    {
        "url": "//ajax.googleapis.com/ajax/libs/prototype/1/prototype.js",
        "label": "Prototype latest",
        "group": "Prototype"
    },
    {
        "url": "//ajax.googleapis.com/ajax/libs/prototype/1.7/prototype.js",
        "label": "Prototype 1.7.1",
        "group": "Prototype"
    },
    {
        "url": "//ajax.googleapis.com/ajax/libs/prototype/1.6.1.0/prototype.js",
        "label": "Prototype 1.6.1.0",
        "group": "Prototype"
    },
    {
        "url": [
            "//ajax.googleapis.com/ajax/libs/prototype/1/prototype.js",
            "//ajax.googleapis.com/ajax/libs/scriptaculous/1/scriptaculous.js"
        ],
        "label": "script.aculo.us latest",
        "group": "Prototype"
    },
    {
        "url": [
            "//ajax.googleapis.com/ajax/libs/prototype/1/prototype.js",
            "//ajax.googleapis.com/ajax/libs/scriptaculous/1.8.3/scriptaculous.js"
        ],
        "label": "script.aculo.us 1.8.3",
        "group": "Prototype"
    },
    {
        "url": "//yui.yahooapis.com/3.10.0/build/yui/yui.js",
        "label": "YUI 3.10.0",
        "group": "YUI"
    },
    {
        "url": "//yui.yahooapis.com/2.9.0/build/yuiloader/yuiloader-min.js",
        "label": "YUI 2.9.0",
        "group": "YUI"
    },
    {
        "url": "//ajax.googleapis.com/ajax/libs/mootools/1/mootools-yui-compressed.js",
        "label": "MooTools latest",
        "group": "MooTools"
    },
    {
        "url": "//ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js",
        "label": "MooTools 1.4.5",
        "group": "MooTools"
    },
    {
        "url": "//ajax.googleapis.com/ajax/libs/dojo/1/dojo/dojo.js",
        "label": "Dojo latest",
        "group": "Dojo"
    },
    {
        "url": "//ajax.googleapis.com/ajax/libs/dojo/1.8/dojo/dojo.js",
        "label": "Dojo 1.8.4",
        "group": "Dojo"
    },
    {
        "url": "//ajax.googleapis.com/ajax/libs/dojo/1.7/dojo/dojo.js",
        "label": "Dojo 1.7.4",
        "group": "Dojo"
    },
    {
        "url": [
            "//ajax.googleapis.com/ajax/libs/dojo/1/dijit/themes/claro/claro.css",
            "//ajax.googleapis.com/ajax/libs/dojo/1/dojo/dojo.js"
        ],
        "label": "Dijit latest (Claro)",
        "group": "Dojo"
    },
    {
        "url": [
            "//ajax.googleapis.com/ajax/libs/dojo/1.8.4/dijit/themes/claro/claro.css",
            "//ajax.googleapis.com/ajax/libs/dojo/1.8.4/dojo/dojo.js"
        ],
        "label": "Dijit 1.8.4 (Claro)",
        "group": "Dojo"
    },
    {
        "url": [
            "//ajax.googleapis.com/ajax/libs/dojo/1.7.4/dijit/themes/claro/claro.css",
            "//ajax.googleapis.com/ajax/libs/dojo/1.7.4/dojo/dojo.xd.js"
        ],
        "label": "Dijit 1.7.4 (Claro)",
        "group": "Dojo"
    },
    {
        "url": [
            "//cdn.kendostatic.com/2013.1.319/styles/kendo.common.min.css",
            "//cdn.kendostatic.com/2013.1.319/styles/kendo.rtl.min.css",
            "//cdn.kendostatic.com/2013.1.319/styles/kendo.default.min.css",
            "//cdn.kendostatic.com/2013.1.319/styles/kendo.dataviz.min.css",
            "//cdn.kendostatic.com/2013.1.319/styles/kendo.dataviz.default.min.css",
            "//cdn.kendostatic.com/2013.1.319/styles/kendo.mobile.all.min.css",
            "//code.jquery.com/jquery-1.9.1.min.js",
            "//cdn.kendostatic.com/2013.1.319/js/kendo.all.min.js"
        ],
        "label": "Kendo UI Q1 2013",
        "group": "Kendo UI"
    },
    {
        "url": [
            "//cdn.kendostatic.com/2012.3.1114/styles/kendo.common.min.css",
            "//cdn.kendostatic.com/2012.3.1114/styles/kendo.rtl.min.css",
            "//cdn.kendostatic.com/2012.3.1114/styles/kendo.default.min.css",
            "//cdn.kendostatic.com/2012.3.1114/styles/kendo.dataviz.min.css",
            "//cdn.kendostatic.com/2012.3.1114/styles/kendo.dataviz.default.min.css",
            "//cdn.kendostatic.com/2012.3.1114/styles/kendo.mobile.all.min.css",
            "//code.jquery.com/jquery-1.8.2.min.js",
            "//cdn.kendostatic.com/2012.3.1114/js/kendo.all.min.js"
        ],
        "label": "Kendo UI Q3 2012",
        "group": "Kendo UI"
    },
    {
        "url" : [
            "//code.jquery.com/qunit/qunit-git.css",
            "//code.jquery.com/qunit/qunit-git.js"
        ],
        "label": "QUnit",
        "group": "Testing"
    },
    {
        "url": "//zeptojs.com/zepto.min.js",
        "label": "Zepto latest",
        "group": "Zepto"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min.js",
        "label": "Zepto 1.0",
        "group": "Zepto"
    },
    {
        "url":"https://ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular.min.js",
        "label": "Angular 1.1.5 Unstable",
        "group": "Angular"
    },
    {
        "url":"https://ajax.googleapis.com/ajax/libs/angularjs/1.0.7/angular.min.js",
        "label": "Angular 1.0.7 Stable",
        "group": "Angular"
    },
    {
        "url": [
            "//nightly.enyojs.com/latest/enyo-nightly/enyo.css",
            "//nightly.enyojs.com/latest/enyo-nightly/enyo.js",
            "//nightly.enyojs.com/latest/lib/layout/package.js",
            "//nightly.enyojs.com/latest/lib/onyx/package.js",
            "//nightly.enyojs.com/latest/lib/g11n/package.js",
            "//nightly.enyojs.com/latest/lib/canvas/package.js"
        ],
        "label": "Enyo latest",
        "group": "Enyo"
    },
    {
        "url": [
            "//enyojs.com/enyo-2.2.0/enyo.css",
            "//enyojs.com/enyo-2.2.0/enyo.js",
            "//enyojs.com/enyo-2.2.0/lib/layout/package.js",
            "//enyojs.com/enyo-2.2.0/lib/onyx/package.js",
            "//enyojs.com/enyo-2.2.0/lib/g11n/package.js",
            "//enyojs.com/enyo-2.2.0/lib/canvas/package.js"
        ],
        "label": "Enyo 2.2.0",
        "group": "Enyo"
    },
    {
        "url": [
            "//documentcloud.github.io/underscore/underscore-min.js",
            "//documentcloud.github.io/backbone/backbone-min.js"
        ],
        "label": "Backbone latest"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/bonsai/0.4/bonsai.min.js",
        "label": "Bonsai 0.4.latest"
    },
    {
        "url": "//jashkenas.github.io/coffee-script/extras/coffee-script.js",
        "label": "CoffeeScript"
    },
    {
        "url": [
            "//code.jquery.com/jquery.js",
            "//cdnjs.cloudflare.com/ajax/libs/ember.js/1.0.0-rc.4/ember.min.js"
        ],
        "label": "Ember.js 1.0.0-rc.4"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/es5-shim/2.0.8/es5-shim.min.js",
        "label": "ES5 shim 2.0.8"
    },
    {
        "url": [
            "//extjs.cachefly.net/ext-3.1.0/resources/css/ext-all.css",
            "//cdnjs.cloudflare.com/ajax/libs/ext-core/3.1.0/ext-core.min.js"
        ],
        "label": "ext-core 3.1.0"
    },
    {
        "url": [
            "//cdnjs.cloudflare.com/ajax/libs/foundation/4.1.6/css/normalize.min.css",
            "//cdnjs.cloudflare.com/ajax/libs/foundation/4.1.6/css/foundation.min.css",
            "//cdnjs.cloudflare.com/ajax/libs/foundation/4.1.6/js/vendor/custom.modernizr.min.js",
            "//cdnjs.cloudflare.com/ajax/libs/foundation/4.1.6/js/vendor/jquery.min.js",
            "//cdnjs.cloudflare.com/ajax/libs/foundation/4.1.6/js/foundation.min.js"
        ],
        "label": "Foundation 4.1.6"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0/handlebars.min.js",
        "label": "Handlebars.js 1.0.0"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/knockout/2.2.1/knockout-min.js",
        "label": "Knockout 2.2.1"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/less.js/1.3.3/less.min.js",
        "label": "Less 1.3.3"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/lodash.js/1.2.1/lodash.min.js",
        "label": "lodash 1.2.1"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js",
        "label": "Modernizr 2.6.2"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js",
        "label": "Prefixfree 1.0.7"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.1/processing-api.min.js",
        "label": "Processing 1.4.1"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js",
        "label": "Rapha&euml;l 2.1.0"
    },
    {
        "url": "//cdnjs.cloudflare.com/ajax/libs/sammy.js/0.7.4/sammy.min.js",
        "label": "Sammy 0.7.4"
    },
    {
        "url": [
            "//cdn.sencha.io/touch/1.1.0/resources/css/sencha-touch.css",
            "//cdn.sencha.io/touch/1.1.0/sencha-touch.js"
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
        "url": "//remy.github.io/twitterlib/twitterlib.min.js",
        "label": "TwitterLib"
    },
    {
        "url": "//documentcloud.github.io/underscore/underscore-min.js",
        "label": "underscore latest"
    },
    {
        "url":[
            "//code.jquery.com/jquery-1.9.1.min.js",
            " //canjs.us/release/latest/can.jquery.js"
        ],
        "label": "CanJS for jQuery"
    },
    {
        "url":[
            "//cdnjs.cloudflare.com/ajax/libs/three.js/r58/three.min.js"
        ],
        "label": "Three.js r58"
    },
    {
        "url":[
            "//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.6.2/html5shiv.js"
        ],
        "label": "HTML5 shiv"
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
