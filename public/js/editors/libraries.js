var libraries = [
  {
    'url': 'https://code.jquery.com/jquery-git.js',
    'label': 'jQuery WIP (via git)',
    'group': 'jQuery'
  },
  {
    'url': 'https://code.jquery.com/jquery-3.1.0.js',
    'label': 'jQuery 3.1.0',
    'group': 'jQuery'
  },
  {
    'url': 'https://code.jquery.com/jquery-3.0.0.js',
    'label': 'jQuery 3.0.0',
    'group': 'jQuery'
  },
  {
    'url': 'https://code.jquery.com/jquery-2.2.4.js',
    'label': 'jQuery 2.2.4',
    'group': 'jQuery'
  },
  {
    'url': 'https://code.jquery.com/jquery-2.1.4.js',
    'label': 'jQuery 2.1.4',
    'group': 'jQuery'
  },
  {
    'url': 'https://code.jquery.com/jquery-2.0.3.js',
    'label': 'jQuery 2.0.3',
    'group': 'jQuery'
  },
  {
    'url': 'https://code.jquery.com/jquery-1.12.4.js',
    'label': 'jQuery 1.12.4',
    'group': 'jQuery'
  },
  {
    'url': 'https://code.jquery.com/jquery-1.11.3.js',
    'label': 'jQuery 1.11.3',
    'group': 'jQuery'
  },
  {
    'url': 'https://code.jquery.com/jquery-1.10.2.js',
    'label': 'jQuery 1.10.2',
    'group': 'jQuery'
  },
  {
    'url': 'https://code.jquery.com/jquery-1.9.1.js',
    'label': 'jQuery 1.9.1',
    'group': 'jQuery'
  },
  {
    'url': 'https://code.jquery.com/jquery-1.8.3.js',
    'label': 'jQuery 1.8.3',
    'group': 'jQuery'
  },
  {
    'url': 'https://code.jquery.com/jquery-1.7.2.js',
    'label': 'jQuery 1.7.2',
    'group': 'jQuery'
  },
  {
    'url': 'https://code.jquery.com/jquery-1.6.4.js',
    'label': 'jQuery 1.6.4',
    'group': 'jQuery'
  },
  {
    'url': [
      'https://code.jquery.com/ui/jquery-ui-git.css',
      'https://code.jquery.com/jquery-git.js',
      'https://code.jquery.com/ui/jquery-ui-git.js'
    ],
    'label': 'jQuery UI WIP (via git)',
    'group': 'jQuery UI'
  },
  {
    'url': [
      'https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css',
      'https://code.jquery.com/jquery-3.1.0.js',
      'https://code.jquery.com/ui/1.12.1/jquery-ui.js'
    ],
    'label': 'jQuery UI 1.12.1',
    'group': 'jQuery UI'
  },
  {
    'url': [
      'https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css',
      'https://code.jquery.com/jquery-1.12.4.js',
      'https://code.jquery.com/ui/1.11.4/jquery-ui.js'
    ],
    'label': 'jQuery UI 1.11.4',
    'group': 'jQuery UI'
  },
  {
    'url': [
      'https://code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css',
      'https://code.jquery.com/jquery-1.11.3.js',
      'https://code.jquery.com/ui/1.10.4/jquery-ui.js'
    ],
    'label': 'jQuery UI 1.10.4',
    'group': 'jQuery UI'
  },
  {
    'url': [
      'https://code.jquery.com/ui/1.9.2/themes/smoothness/jquery-ui.css',
      'https://code.jquery.com/jquery-1.8.3.js',
      'https://code.jquery.com/ui/1.9.2/jquery-ui.js'
    ],
    'label': 'jQuery UI 1.9.2',
    'group': 'jQuery UI'
  },
  {
    'url': [
      'https://code.jquery.com/mobile/git/jquery.mobile-git.css',
      'https://code.jquery.com/jquery-1.11.3.js',
      'https://code.jquery.com/mobile/git/jquery.mobile-git.js'
    ],
    'label': 'jQuery Mobile WIP (via git)',
    'group': 'jQuery Mobile'
  },
  {
    'url': [
      'https://code.jquery.com/mobile/1.4.2/jquery.mobile-1.4.2.css',
      'https://code.jquery.com/jquery-1.11.3.js',
      'https://code.jquery.com/mobile/1.4.2/jquery.mobile-1.4.2.js'
    ],
    'label': 'jQuery Mobile 1.4.2',
    'group': 'jQuery Mobile'
  },
  {
    'url': [
      'https://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.css',
      'https://code.jquery.com/jquery-1.9.1.js',
      'https://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.js'
    ],
    'label': 'jQuery Mobile 1.3.2',
    'group': 'jQuery Mobile'
  },
  {
    'url': [
      'https://code.jquery.com/mobile/1.2.1/jquery.mobile-1.2.1.css',
      'https://code.jquery.com/jquery-1.8.3.js',
      'https://code.jquery.com/mobile/1.2.1/jquery.mobile-1.2.1.js'
    ],
    'label': 'jQuery Mobile 1.2.1',
    'group': 'jQuery Mobile'
  },
  {
    'url': [
      'https://code.jquery.com/mobile/1.1.2/jquery.mobile-1.1.2.css',
      'https://code.jquery.com/jquery-1.6.4.js',
      'https://code.jquery.com/mobile/1.1.2/jquery.mobile-1.1.2.js'
    ],
    'label': 'jQuery Mobile 1.1.2',
    'group': 'jQuery Mobile'
  },
  {
    'url': [
      'https://code.jquery.com/jquery.min.js',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js'
    ],
    'label': 'Bootstrap Latest',
    'group': 'Bootstrap'
  },
  {
    'url': [
      'https://code.jquery.com/jquery.min.js',
      'https://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css',
      'https://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js'
    ],
    'label': 'Bootstrap 2.3.2',
    'group': 'Bootstrap'
  },
  {
    'url': 'https://ajax.googleapis.com/ajax/libs/prototype/1/prototype.js',
    'label': 'Prototype latest',
    'group': 'Prototype'
  },
  {
    'url': 'https://ajax.googleapis.com/ajax/libs/prototype/1.7/prototype.js',
    'label': 'Prototype 1.7.1',
    'group': 'Prototype'
  },
  {
    'url': 'https://ajax.googleapis.com/ajax/libs/prototype/1.6.1.0/prototype.js',
    'label': 'Prototype 1.6.1.0',
    'group': 'Prototype'
  },
  {
    'url': [
      'https://ajax.googleapis.com/ajax/libs/prototype/1/prototype.js',
      'https://ajax.googleapis.com/ajax/libs/scriptaculous/1/scriptaculous.js'
    ],
    'label': 'script.aculo.us latest',
    'group': 'Prototype'
  },
  {
    'url': [
      'https://ajax.googleapis.com/ajax/libs/prototype/1/prototype.js',
      'https://ajax.googleapis.com/ajax/libs/scriptaculous/1.8.3/scriptaculous.js'
    ],
    'label': 'script.aculo.us 1.8.3',
    'group': 'Prototype'
  },
  {
    'url': 'http://yui.yahooapis.com/3.10.0/build/yui/yui.js',
    'label': 'YUI 3.10.0',
    'group': 'YUI'
  },
  {
    'url': 'http://yui.yahooapis.com/2.9.0/build/yuiloader/yuiloader-min.js',
    'label': 'YUI 2.9.0',
    'group': 'YUI'
  },
  {
    'url': 'https://ajax.googleapis.com/ajax/libs/mootools/1.5.0/mootools-yui-compressed.js',
    'label': 'MooTools 1.5.0',
    'group': 'MooTools'
  },
  {
    'url': 'https://ajax.googleapis.com/ajax/libs/mootools/1.5.0/mootools-nocompat-yui-compressed.js',
    'label': 'MooTools 1.5.0 (without 1.2+ compatibility layer)',
    'group': 'MooTools'
  },
  {
    'url': 'https://ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js',
    'label': 'MooTools 1.4.5',
    'group': 'MooTools'
  },
  {
    'url': 'https://ajax.googleapis.com/ajax/libs/dojo/1/dojo/dojo.js',
    'label': 'Dojo latest',
    'group': 'Dojo'
  },
  {
    'url': 'https://ajax.googleapis.com/ajax/libs/dojo/1.8/dojo/dojo.js',
    'label': 'Dojo 1.8.4',
    'group': 'Dojo'
  },
  {
    'url': 'https://ajax.googleapis.com/ajax/libs/dojo/1.7/dojo/dojo.js',
    'label': 'Dojo 1.7.4',
    'group': 'Dojo'
  },
  {
    'url': [
      'https://ajax.googleapis.com/ajax/libs/dojo/1/dijit/themes/claro/claro.css',
      'https://ajax.googleapis.com/ajax/libs/dojo/1/dojo/dojo.js'
    ],
    'label': 'Dijit latest (Claro)',
    'group': 'Dojo'
  },
  {
    'url': [
      'https://ajax.googleapis.com/ajax/libs/dojo/1.8.4/dijit/themes/claro/claro.css',
      'https://ajax.googleapis.com/ajax/libs/dojo/1.8.4/dojo/dojo.js'
    ],
    'label': 'Dijit 1.8.4 (Claro)',
    'group': 'Dojo'
  },
  {
    'url': [
      'https://ajax.googleapis.com/ajax/libs/dojo/1.7.4/dijit/themes/claro/claro.css',
      'https://ajax.googleapis.com/ajax/libs/dojo/1.7.4/dojo/dojo.xd.js'
    ],
    'label': 'Dijit 1.7.4 (Claro)',
    'group': 'Dojo'
  },
  {
    'url': [
      'https://da7xgjtj801h2.cloudfront.net/2015.2.624/styles/kendo.common.min.css',
      'https://da7xgjtj801h2.cloudfront.net/2015.2.624/styles/kendo.silver.min.css',
      'https://code.jquery.com/jquery-2.1.4.min.js',
      'https://da7xgjtj801h2.cloudfront.net/2015.2.624/js/kendo.ui.core.min.js'
    ],
    'label': 'Kendo UI Core 2015.2.624',
    'group': 'Kendo UI'
  },
  {
    'url': [
      'https://da7xgjtj801h2.cloudfront.net/2014.3.1411/styles/kendo.common.min.css',
      'https://da7xgjtj801h2.cloudfront.net/2014.3.1411/styles/kendo.default.min.css',
      'https://code.jquery.com/jquery-1.9.1.min.js',
      'https://da7xgjtj801h2.cloudfront.net/2014.3.1411/js/kendo.ui.core.min.js'
    ],
    'label': 'Kendo UI Core 2014.3.1411',
    'group': 'Kendo UI'
  },
  {
    'url' : [
      'https://code.jquery.com/qunit/qunit-git.css',
      'https://code.jquery.com/qunit/qunit-git.js'
    ],
    'label': 'QUnit',
    'group': 'Testing'
  },
  {
    'url' : [
    'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.14/require.js',
  ],
    'label': 'RequireJS',
    'group': 'AMD'
  },
  {
    'url': 'http://zeptojs.com/zepto.min.js',
    'label': 'Zepto latest',
    'group': 'Zepto'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min.js',
    'label': 'Zepto 1.0',
    'group': 'Zepto'
  },
  {
    'url':'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular.min.js',
    'label': 'Angular 1.4.0 Stable',
    'group': 'Angular'
  },
  {
    'url': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0/angular.js',
    'label': 'Angular 1.4.0 Stable Uncompressed',
    'group': 'Angular'
  },
  {
    'url':'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js',
    'label': 'Angular 1.3.15 Stable',
    'group': 'Angular'
  },
  {
    'url': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.js',
    'label': 'Angular 1.3.15 Stable Uncompressed',
    'group': 'Angular'
  },
  {
    'url': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min.js',
    'label': 'Angular 1.2.26 Legacy',
    'group': 'Angular'
  },
  {
    'url':'https://rawgit.com/angular/bower-angular/master/angular.min.js',
    'label': 'Angular Latest',
    'group': 'Angular'
  },
  {
    'url': 'https://rawgit.com/angular/bower-angular/master/angular.js',
    'label': 'Angular Latest Uncompressed',
    'group': 'Angular'
  },
  {
    'url': 'https://rawgit.com/angular/bower-angular-animate/master/angular-animate.min.js',
    'label': 'Angular Animate Latest',
    'group': 'Angular'
  },
  {
    'url': 'https://rawgit.com/angular/bower-angular-aria/master/angular-aria.min.js',
    'label': 'Angular Aria Latest',
    'group': 'Angular'
  },
  {
    'url': 'https://rawgit.com/angular/bower-angular-messages/master/angular-messages.min.js',
    'label': 'Angular Messages Latest',
    'group': 'Angular'
  },
  {
    'url': 'https://rawgit.com/angular/bower-angular-resource/master/angular-resource.min.js',
    'label': 'Angular Resource Latest',
    'group': 'Angular'
  },
  {
    'url': 'https://rawgit.com/angular/bower-angular-route/master/angular-route.min.js',
    'label': 'Angular Route Latest',
    'group': 'Angular'
  },
  {
    'url': 'https://rawgit.com/angular/bower-angular-sanitize/master/angular-sanitize.min.js',
    'label': 'Angular Sanitize Latest',
    'group': 'Angular'
  },
  {
    'url': ['https://fb.me/react-15.1.0.js', 'https://fb.me/react-dom-15.1.0.js'],
    'label': 'React + React DOM 15.1.0',
    'group': 'React'
  },
  {
    'url': ['https://fb.me/react-with-addons-15.1.0.js', 'https://fb.me/react-dom-15.1.0.js'],
    'label': 'React with Add-Ons + React DOM 15.1.0',
    'group': 'React'
  },
  {
    'url': ['https://fb.me/react-0.14.7.js', 'https://fb.me/react-dom-0.14.7.js'],
    'label': 'React + React DOM 0.14.7',
    'group': 'React'
  },
  {
    'url': ['https://fb.me/react-with-addons-0.14.7.js', 'https://fb.me/react-dom-0.14.7.js'],
    'label': 'React with Add-Ons + React DOM 0.14.7',
    'group': 'React'
  },
  {
    'url': 'https://fb.me/react-0.13.3.js',
    'label': 'React 0.13.3',
    'group': 'React'
  },
  {
    'url': 'https://fb.me/react-with-addons-0.13.3.js',
    'label': 'React with Add-Ons 0.13.3',
    'group': 'React'
  },
  {
    'url': 'https://cdn.rawgit.com/zloirock/core-js/master/client/shim.min.js',
    'label': 'core-js',
    'group': 'shims'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/es5-shim/2.0.8/es5-shim.min.js',
    'label': 'ES5 shim 2.0.8',
    'group': 'shims'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/blissfuljs/1.0.2/bliss.min.js',
    'label': 'Bliss 1.0.2',
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.16/vue.js',
    'label': 'Vue.js',
  },
  {
    'url': 'http://cdn.ractivejs.org/latest/ractive.js',
    'label': 'Ractive.js'
  },
  {
    'url': [
      'http://nightly.enyojs.com/latest/enyo-nightly/enyo.css',
      'http://nightly.enyojs.com/latest/enyo-nightly/enyo.js',
      'http://nightly.enyojs.com/latest/lib/layout/package.js',
      'http://nightly.enyojs.com/latest/lib/onyx/package.js',
      'http://nightly.enyojs.com/latest/lib/g11n/package.js',
      'http://nightly.enyojs.com/latest/lib/canvas/package.js'
    ],
    'label': 'Enyo latest',
    'group': 'Enyo'
  },
  {
    'url': [
      'http://enyojs.com/enyo-2.2.0/enyo.css',
      'http://enyojs.com/enyo-2.2.0/enyo.js',
      'http://enyojs.com/enyo-2.2.0/lib/layout/package.js',
      'http://enyojs.com/enyo-2.2.0/lib/onyx/package.js',
      'http://enyojs.com/enyo-2.2.0/lib/g11n/package.js',
      'http://enyojs.com/enyo-2.2.0/lib/canvas/package.js'
    ],
    'label': 'Enyo 2.2.0',
    'group': 'Enyo'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/bluebird/1.2.2/bluebird.js',
    'label': 'Bluebird 1.2.2',
    'group': 'Promises'
  },
  {
    'url': 'https://www.promisejs.org/polyfills/promise-4.0.0.js',
    'label': 'Promise 4.0.0',
    'group': 'Promises'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/q.js/1.0.1/q.js',
    'label': 'Q 1.0.1',
    'group': 'Promises'
  },
  {
    'url': '//cdn.jsdelivr.net/rsvp/3.0.6/rsvp.js',
    'label': 'RSVP 3.0.6',
    'group': 'Promises'
  },
  {
    'url': [
      'https://rawgithub.com/ai/autoprefixer-rails/master/vendor/autoprefixer.js'
    ],
    'label': 'Autoprefixer',
    'snippet': '<style type="unprocessed" id="AutoprefixerIn">%css%</style>\n<style id="AutoprefixerOut"></style>\n<script>\nAutoprefixerSettings = ""; //Specify here the browsers you want to target or leave empty\ndocument.getElementById("AutoprefixerOut").innerHTML = autoprefixer(AutoprefixerSettings || null).process(document.getElementById("AutoprefixerIn").innerHTML).css;\n</script>'
  },
  {
    'url': [
      'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js'
    ],
    'label': 'Backbone 1.1.2'
  },
  {
    'url': [
      'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js',
      'http://marionettejs.com/downloads/backbone.marionette.min.js'
    ],
    'label': 'MarionetteJS latest'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/bonsai/0.4/bonsai.min.js',
    'label': 'Bonsai 0.4.latest'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/coffee-script/1.9.2/coffee-script.min.js',
    'label': 'CoffeeScript'
  },
  {
    'url': [
      'https://code.jquery.com/jquery-1.11.1.min.js',
      '//builds.emberjs.com/tags/v1.13.5/ember-template-compiler.js',
      '//builds.emberjs.com/tags/v1.13.5/ember.debug.js'
    ],
    'label': 'Ember.js 1.13.5',
    'group': 'Ember'
  },
  {
    'url': '//builds.emberjs.com/tags/v1.13.6/ember-data.js',
    'label': 'Ember Data 1.13.6',
    'group': 'Ember'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.2/normalize.min.css',
    'label': 'Normalize.css 3.0.2'
  },
  {
    'url': [
      '//extjs.cachefly.net/ext-3.1.0/resources/css/ext-all.css',
      'https://cdnjs.cloudflare.com/ajax/libs/ext-core/3.1.0/ext-core.min.js'
    ],
    'label': 'ext-core 3.1.0'
  },
  {
    'url': [
      'https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.2/css/normalize.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.2/css/foundation.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.2/js/vendor/modernizr.js',
      'https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.2/js/vendor/jquery.js',
      'https://cdnjs.cloudflare.com/ajax/libs/foundation/5.5.2/js/foundation.min.js'
    ],
    'label': 'Foundation 5.5.2'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0/handlebars.js',
    'label': 'Handlebars.js 1.0.0'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js',
    'label': 'Knockout 3.3.0'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/less.js/1.3.3/less.min.js',
    'label': 'Less 1.3.3'
  },
  {
    'url': 'https://cdn.jsdelivr.net/lodash/4/lodash.min.js',
    'label': 'lodash 4.x',
    'group': 'Lodash'
  },
  {
    'url': 'https://cdn.jsdelivr.net/g/lodash@4(lodash.min.js+lodash.fp.min.js)',
    'label': 'lodash fp 4.x',
    'group': 'Lodash'
  },
  {
    'url': 'https://cdn.jsdelivr.net/lodash/3/lodash.min.js',
    'label': 'lodash 3.x',
    'group': 'Lodash'
  },
  {
    'url': 'http://modernizr.com/downloads/modernizr-latest.js',
    'label': 'Modernizr Development latest'
  },
  {
    'url': [
      'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/detectizr/1.5.0/detectizr.min.js'
    ],
    'label': 'Detectizr 1.5.0'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js',
    'label': 'Prefixfree 1.0.7'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.1/processing-api.min.js',
    'label': 'Processing 1.4.1'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/d3/4.2.3/d3.min.js',
    'label': 'D3 4.2.3',
    'group': 'D3'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js',
    'label': 'D3 3.5.6',
    'group': 'D3'
  },
  {
    'url': '//code.highcharts.com/highcharts.js',
    'label': 'Highcharts latest'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js',
    'label': 'Rapha&euml;l 2.1.0'
  },
  {
    'url': [
      '//cdn.jsdelivr.net/chartist.js/latest/chartist.min.js',
      '//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css'
    ],
    'label': 'Chartist.js latest'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/sammy.js/0.7.4/sammy.min.js',
    'label': 'Sammy 0.7.4'
  },
  {
    'url': [
      'http://cdn.sencha.io/touch/1.1.0/resources/css/sencha-touch.css',
      'http://cdn.sencha.io/touch/1.1.0/sencha-touch.js'
    ],
    'label': 'Sencha Touch'
  },
  {
    'url': [
      jsbin.static + '/js/vendor/traceur.js'
    ],
    'label': 'Traceur'
  },
  {
    'url': '//remy.github.io/twitterlib/twitterlib.min.js',
    'label': 'TwitterLib'
  },
  {
    'url': '//jashkenas.github.io/underscore/underscore-min.js',
    'label': 'underscore'
  },
  {
    'url':[
      'https://code.jquery.com/jquery.min.js',
      '//canjs.com/release/2.0.3/can.jquery.min.js'
    ],
    'label': 'CanJS 2.0.3'
  },
  {
    'url':[
      'https://cdnjs.cloudflare.com/ajax/libs/three.js/r72/three.min.js'
    ],
    'label': 'Three.js r72'
  },
  {
    'url':[
      'https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.6.2/html5shiv.js'
    ],
    'label': 'HTML5 shiv'
  },
  {
    'url': [
      'https://cdnjs.cloudflare.com/ajax/libs/polymer/0.3.3/platform.js',
      'https://cdnjs.cloudflare.com/ajax/libs/polymer/0.3.3/polymer.js'
    ],
    'label': 'Polymer 0.3.3'
  },
  {
    'url':[
      'https://code.getmdl.io/1.2.1/material.indigo-pink.min.css',
      'https://code.getmdl.io/1.2.1/material.min.js',
      'https://fonts.googleapis.com/icon?family=Material+Icons'
      ],
    'label': 'Material Design Lite 1.2.1'
  },
  {
    'url': '//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css',
    'label': 'Font Awesome 4.0.3'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.9.12/paper.js',
    'label': 'Paper.js 0.9.12'
  },
  {
    'url': {
      'url': 'https://openui5.hana.ondemand.com/resources/sap-ui-core.js',
      'id': 'sap-ui-bootstrap',
      'data-sap-ui-theme': 'sap_bluecrystal',
      'data-sap-ui-libs': 'sap.m'
    },
    'label': 'OpenUI5 latest (Mobile BlueCrystal)'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.7/TweenMax.min.js',
    'label': 'GSAP 1.11.7'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/phaser/2.0.5/phaser.min.js',
    'label': 'Phaser 2.0.5'
  },
  {
    'url': [
      '//vjs.zencdn.net/5.6/video-js.css',
      '//vjs.zencdn.net/5.6/video.js'
    ],
    'label': 'Video.js 5.6.x'
  },
  {
    'url': [
      'https://aui-cdn.atlassian.com/aui-adg/5.7.0/js/aui.js',
      'https://aui-cdn.atlassian.com/aui-adg/5.7.0/css/aui.css',
      'https://aui-cdn.atlassian.com/aui-adg/5.7.0/js/aui-experimental.js',
      'https://aui-cdn.atlassian.com/aui-adg/5.7.0/css/aui-experimental.css'
    ],
    'label': 'AUI (Atlassian UI) 5.7.0'
  },
  {
    'url': 'https://cdn.firebase.com/js/client/2.0.2/firebase.js',
    'label': 'Firebase 2.0.2'
  },
  {
    'url': [
      'https://code.ionicframework.com/1.0.0-beta.13/js/ionic.bundle.min.js',
      'https://code.ionicframework.com/1.0.0-beta.13/css/ionic.min.css'
    ],
    'label': 'Ionic 1.0.0-beta-13'
  },
  {
    'url': '//static.opentok.com/v2/js/opentok.min.js',
    'label': 'OpenTok v2.x (latest)'
  },
  {
    'url': 'https://cdn.jsdelivr.net/riot/2.3/riot+compiler.min.js',
    'label': 'Riot + Compiler (latest 2.3.x)'
  },
  {
    'url': [
      'https://cdn.jsdelivr.net/blazecss/latest/blaze.min.css',
      'https://cdn.jsdelivr.net/blazecss/latest/blaze.animations.min.css'
    ],
    'label': 'Blaze CSS (latest)'
  },
  {
    'url': 'https://unpkg.com/@reactivex/rxjs@5.0.0-beta.7/dist/global/Rx.umd.js',
    'label': 'RxJS 5.0.0-beta.7',
    'group': 'RxJS'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/rxjs/4.0.6/rx.all.js',
    'label': 'rx.all 4.0.6',
    'group': 'RxJS'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/rxjs/4.0.6/rx.all.compat.js',
    'label': 'rx.all.compat 4.0.6',
    'group': 'RxJS'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/rxjs/4.0.6/rx.testing.js',
    'label': 'rx.testing 4.0.6',
    'group': 'RxJS'
  },
  {
    'url': 'https://unpkg.com/rx-dom@7.0.3/dist/rx.dom.js',
    'label': 'rx.dom 7.0.3 (requires 4.x)',
    'group': 'RxJS'
  },
  {
    'url': 'http://cdn.popcornjs.org/code/dist/popcorn.min.js',
    'label': 'Popcorn.js 1.5.6 (Core)',
    'group': 'Popcorn.js'
  },
  {
    'url': 'http://cdn.popcornjs.org/code/dist/popcorn-complete.min.js',
    'label': 'Popcorn.js 1.5.6 (Core + Extensions)',
    'group': 'Popcorn.js'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/immutable/3.7.3/immutable.min.js',
    'label': 'Immutable 3.7.3',
    'group': 'Data structures'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/mori/0.3.2/mori.js',
    'label': 'mori 0.3.2',
    'group': 'Data structures'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.22.1/ramda.min.js',
    'label': 'Ramda 0.22.1'
  },
  {
    'url': [
      'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.js'
    ],
    'label': 'Semantic UI 2.2.2'
  },
  {
    'url': 'https://cdn.jsdelivr.net/pouchdb/latest/pouchdb.min.js',
    'label': 'PouchDB (latest)',
    'group': 'PouchDB'
  },
  {
    'url': 'https://cdn.jsdelivr.net/momentjs/2.14.1/moment-with-locales.min.js',
    'label': 'Moment 2.14.1',
    'group': 'Moment.js'
  },
  {
    'url': [
      'https://cdn.jsdelivr.net/momentjs/2.14.1/moment-with-locales.min.js',
      'https://cdn.jsdelivr.net/momentjs/2.14.1/locales.min.js'
    ],
    'label': 'Moment 2.14.1 (with locales)',
    'group': 'Moment.js'
  },
  {
    'url': '//cdn.jsdelivr.net/velocity/1.2.3/velocity.min.js',
    'label': 'Velocity JS 1.2.3',
    'group': 'Velocity'
  },
  {
    'url': '//cdn.jsdelivr.net/velocity/1.2.3/velocity.ui.min.js',
    'label': 'Velocity UI Pack 1.2.3',
    'group': 'Velocity'
  }
];

window.libraries = libraries; // expose a command line API

libraries.userSpecified = JSON.parse(store.localStorage.getItem('libraries') || '[]');
for (var i = 0; i < libraries.userSpecified.length; i++) {
  libraries.push(libraries.userSpecified[i]);
}

libraries.add = function (lib) {
  // Extract each script from a list (as documented) or use the default way
  if (lib.scripts) {
    lib.scripts.forEach(function (script) {
      script.group = lib.text;
      script.label = script.text;
      libraries.userSpecified.push(script);
      libraries.push(script);
    });
  } else {
    // Adding a lib according to the above schema
    lib.group = 'Custom';
    libraries.userSpecified.push(lib);
    libraries.push(lib);
  }
  try {
    store.localStorage.setItem('libraries', JSON.stringify(this.userSpecified));
  } catch (e) {} // just in case of DOM_22 error, makes me so sad to use this :(
  $('#library').trigger('init');
};

libraries.clear = function () {
  libraries.userSpecified = [];
  store.localStorage.removeItem('libraries');
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
