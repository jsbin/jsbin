var libraries = [
  {
    'url': '//code.jquery.com/jquery-git.js',
    'label': 'jQuery WIP (via git)',
    'group': 'jQuery'
  },
  {
    'url': '//code.jquery.com/jquery-2.1.1.min.js',
    'label': 'jQuery 2.1.1',
    'group': 'jQuery'
  },
  {
    'url': '//code.jquery.com/jquery-compat-git.js',
    'label': 'jQuery Compat WIP (via git)',
    'group': 'jQuery'
  },
  {
    'url': '//code.jquery.com/jquery-1.11.1.min.js',
    'label': 'jQuery 1.11.1',
    'group': 'jQuery'
  },
  {
    'url': '//code.jquery.com/jquery-1.9.1.min.js',
    'label': 'jQuery 1.9.1',
    'group': 'jQuery'
  },
  {
    'url': [
      '//code.jquery.com/ui/jquery-ui-git.css',
      '//code.jquery.com/jquery-git.js',
      '//code.jquery.com/ui/jquery-ui-git.js'
    ],
    'label': 'jQuery UI WIP (via git)',
    'group': 'jQuery UI'
  },
  {
    'url': [
      '//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.min.css',
      '//code.jquery.com/jquery-1.11.0.min.js',
      '//code.jquery.com/ui/1.11.4/jquery-ui.min.js'
    ],
    'label': 'jQuery UI 1.11.4',
    'group': 'jQuery UI'
  },
  {
    'url': [
      '//code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.min.css',
      '//code.jquery.com/jquery-1.11.0.min.js',
      '//code.jquery.com/ui/1.10.4/jquery-ui.min.js'
    ],
    'label': 'jQuery UI 1.10.4',
    'group': 'jQuery UI'
  },
  {
    'url': [
      '//code.jquery.com/ui/1.9.2/themes/smoothness/jquery-ui.css',
      '//code.jquery.com/jquery-1.8.3.min.js',
      '//code.jquery.com/ui/1.9.2/jquery-ui.js'
    ],
    'label': 'jQuery UI 1.9.2',
    'group': 'jQuery UI'
  },
  {
    'url': [
      '//code.jquery.com/mobile/git/jquery.mobile-git.css',
      '//code.jquery.com/jquery-1.11.0.min.js',
      '//code.jquery.com/mobile/git/jquery.mobile-git.js'
    ],
    'label': 'jQuery Mobile WIP (via git)',
    'group': 'jQuery Mobile'
  },
  {
    'url': [
      '//code.jquery.com/mobile/1.4.2/jquery.mobile-1.4.2.min.css',
      '//code.jquery.com/jquery-1.11.0.min.js',
      '//code.jquery.com/mobile/1.4.2/jquery.mobile-1.4.2.min.js'
    ],
    'label': 'jQuery Mobile 1.4.2',
    'group': 'jQuery Mobile'
  },
  {
    'url': [
      '//code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.css',
      '//code.jquery.com/jquery-1.9.1.min.js',
      '//code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.js'
    ],
    'label': 'jQuery Mobile 1.3.2',
    'group': 'jQuery Mobile'
  },
  {
    'url': [
      '//code.jquery.com/mobile/1.2.1/jquery.mobile-1.2.1.min.css',
      '//code.jquery.com/jquery-1.8.3.min.js',
      '//code.jquery.com/mobile/1.2.1/jquery.mobile-1.2.1.min.js'
    ],
    'label': 'jQuery Mobile 1.2.1',
    'group': 'jQuery Mobile'
  },
  {
    'url': [
      '//code.jquery.com/mobile/1.1.2/jquery.mobile-1.1.2.min.css',
      '//code.jquery.com/jquery-1.6.4.min.js',
      '//code.jquery.com/mobile/1.1.2/jquery.mobile-1.1.2.min.js'
    ],
    'label': 'jQuery Mobile 1.1.2',
    'group': 'jQuery Mobile'
  },
  {
    'url': [
      '//code.jquery.com/jquery.min.js',
      '//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css',
      '//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js'
    ],
    'label': 'Bootstrap Latest',
    'group': 'Bootstrap'
  },
  {
    'url': [
      '//code.jquery.com/jquery.min.js',
      '//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css',
      '//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/js/bootstrap.min.js'
    ],
    'label': 'Bootstrap 2.3.2',
    'group': 'Bootstrap'
  },
  {
    'url': '//ajax.googleapis.com/ajax/libs/prototype/1/prototype.js',
    'label': 'Prototype latest',
    'group': 'Prototype'
  },
  {
    'url': '//ajax.googleapis.com/ajax/libs/prototype/1.7/prototype.js',
    'label': 'Prototype 1.7.1',
    'group': 'Prototype'
  },
  {
    'url': '//ajax.googleapis.com/ajax/libs/prototype/1.6.1.0/prototype.js',
    'label': 'Prototype 1.6.1.0',
    'group': 'Prototype'
  },
  {
    'url': [
      '//ajax.googleapis.com/ajax/libs/prototype/1/prototype.js',
      '//ajax.googleapis.com/ajax/libs/scriptaculous/1/scriptaculous.js'
    ],
    'label': 'script.aculo.us latest',
    'group': 'Prototype'
  },
  {
    'url': [
      '//ajax.googleapis.com/ajax/libs/prototype/1/prototype.js',
      '//ajax.googleapis.com/ajax/libs/scriptaculous/1.8.3/scriptaculous.js'
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
    'url': '//ajax.googleapis.com/ajax/libs/mootools/1.5.0/mootools-yui-compressed.js',
    'label': 'MooTools 1.5.0',
    'group': 'MooTools'
  },
  {
    'url': '//ajax.googleapis.com/ajax/libs/mootools/1.5.0/mootools-nocompat-yui-compressed.js',
    'label': 'MooTools 1.5.0 (without 1.2+ compatibility layer)',
    'group': 'MooTools'
  },
  {
    'url': '//ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js',
    'label': 'MooTools 1.4.5',
    'group': 'MooTools'
  },
  {
    'url': '//ajax.googleapis.com/ajax/libs/dojo/1/dojo/dojo.js',
    'label': 'Dojo latest',
    'group': 'Dojo'
  },
  {
    'url': '//ajax.googleapis.com/ajax/libs/dojo/1.8/dojo/dojo.js',
    'label': 'Dojo 1.8.4',
    'group': 'Dojo'
  },
  {
    'url': '//ajax.googleapis.com/ajax/libs/dojo/1.7/dojo/dojo.js',
    'label': 'Dojo 1.7.4',
    'group': 'Dojo'
  },
  {
    'url': [
      '//ajax.googleapis.com/ajax/libs/dojo/1/dijit/themes/claro/claro.css',
      '//ajax.googleapis.com/ajax/libs/dojo/1/dojo/dojo.js'
    ],
    'label': 'Dijit latest (Claro)',
    'group': 'Dojo'
  },
  {
    'url': [
      '//ajax.googleapis.com/ajax/libs/dojo/1.8.4/dijit/themes/claro/claro.css',
      '//ajax.googleapis.com/ajax/libs/dojo/1.8.4/dojo/dojo.js'
    ],
    'label': 'Dijit 1.8.4 (Claro)',
    'group': 'Dojo'
  },
  {
    'url': [
      '//ajax.googleapis.com/ajax/libs/dojo/1.7.4/dijit/themes/claro/claro.css',
      '//ajax.googleapis.com/ajax/libs/dojo/1.7.4/dojo/dojo.xd.js'
    ],
    'label': 'Dijit 1.7.4 (Claro)',
    'group': 'Dojo'
  },
  {
    'url': [
      '//da7xgjtj801h2.cloudfront.net/2014.2.716/styles/kendo.common.min.css',
      '//da7xgjtj801h2.cloudfront.net/2014.2.716/styles/kendo.default.min.css',
      '//code.jquery.com/jquery-1.9.1.min.js',
      '//da7xgjtj801h2.cloudfront.net/2014.2.716/js/kendo.ui.core.min.js'
    ],
    'label': 'Kendo UI Core 2014.Q2',
    'group': 'Kendo UI'
  },
  {
    'url': [
      '//da7xgjtj801h2.cloudfront.net/2014.2.716/styles/kendo.common.min.css',
      '//da7xgjtj801h2.cloudfront.net/2014.2.716/styles/kendo.rtl.min.css',
      '//da7xgjtj801h2.cloudfront.net/2014.2.716/styles/kendo.default.min.css',
      '//da7xgjtj801h2.cloudfront.net/2014.2.716/styles/kendo.dataviz.min.css',
      '//da7xgjtj801h2.cloudfront.net/2014.2.716/styles/kendo.dataviz.default.min.css',
      '//da7xgjtj801h2.cloudfront.net/2014.2.716/styles/kendo.mobile.all.min.css',
      '//code.jquery.com/jquery-1.9.1.min.js',
      '//da7xgjtj801h2.cloudfront.net/2014.2.716/js/kendo.all.min.js'
    ],
    'label': 'Kendo UI 2014.Q2',
    'group': 'Kendo UI'
  },
  {
    'url': [
      '//da7xgjtj801h2.cloudfront.net/2014.1.318/styles/kendo.common.min.css',
      '//da7xgjtj801h2.cloudfront.net/2014.1.318/styles/kendo.rtl.min.css',
      '//da7xgjtj801h2.cloudfront.net/2014.1.318/styles/kendo.default.min.css',
      '//da7xgjtj801h2.cloudfront.net/2014.1.318/styles/kendo.dataviz.min.css',
      '//da7xgjtj801h2.cloudfront.net/2014.1.318/styles/kendo.dataviz.default.min.css',
      '//da7xgjtj801h2.cloudfront.net/2014.1.318/styles/kendo.mobile.all.min.css',
      '//code.jquery.com/jquery-1.9.1.min.js',
      '//da7xgjtj801h2.cloudfront.net/2014.1.318/js/kendo.all.min.js'
    ],
    'label': 'Kendo UI 2014.Q1',
    'group': 'Kendo UI'
  },
  {
    'url' : [
      '//code.jquery.com/qunit/qunit-git.css',
      '//code.jquery.com/qunit/qunit-git.js'
    ],
    'label': 'QUnit',
    'group': 'Testing'
  },
  {
    'url' : [
    '//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.14/require.js',
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
    'url': '//cdnjs.cloudflare.com/ajax/libs/zepto/1.0/zepto.min.js',
    'label': 'Zepto 1.0',
    'group': 'Zepto'
  },
  {
    'url':'//ajax.googleapis.com/ajax/libs/angularjs/1.3.2/angular.min.js',
    'label': 'Angular 1.3.2 Stable',
    'group': 'Angular'
  },
  {
    'url': '//ajax.googleapis.com/ajax/libs/angularjs/1.3.2/angular.js',
    'label': 'Angular 1.3.2 Stable Uncompressed',
    'group': 'Angular'
  },
  {
    'url': '//ajax.googleapis.com/ajax/libs/angularjs/1.2.26/angular.min.js',
    'label': 'Angular 1.2.26 Legacy',
    'group': 'Angular'
  },
  {
    'url': '//fb.me/react-0.13.1.js',
    'label': 'React 0.13.1',
    'group': 'React'
  },
  {
    'url': '//fb.me/react-with-addons-0.13.1.js',
    'label': 'React with Add-Ons 0.13.1',
    'group': 'React'
  },
  {
    'url': 'http://vuejs.org/js/vue.js',
    'label': 'Vue.js',
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
    'url': '//cdnjs.cloudflare.com/ajax/libs/bluebird/1.2.2/bluebird.js',
    'label': 'Bluebird 1.2.2',
    'group': 'Promises'
  },
  {
    'url': 'https://www.promisejs.org/polyfills/promise-4.0.0.js',
    'label': 'Promise 4.0.0',
    'group': 'Promises'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/q.js/1.0.1/q.js',
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
      '//jashkenas.github.io/underscore/underscore-min.js',
      '//jashkenas.github.io/backbone/backbone-min.js'
    ],
    'label': 'Backbone latest'
  },
  {
    'url': [
      '//jashkenas.github.io/underscore/underscore-min.js',
      '//jashkenas.github.io/backbone/backbone-min.js',
      'http://marionettejs.com/downloads/backbone.marionette.min.js'
    ],
    'label': 'MarionetteJS latest'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/bonsai/0.4/bonsai.min.js',
    'label': 'Bonsai 0.4.latest'
  },
  {
    'url': '//jashkenas.github.io/coffee-script/extras/coffee-script.js',
    'label': 'CoffeeScript'
  },
  {
    'url': [
      '//code.jquery.com/jquery-1.11.1.min.js',
      '//builds.handlebarsjs.com.s3.amazonaws.com/handlebars-v2.0.0.js',
      '//builds.emberjs.com/tags/v1.9.0/ember.js'
    ],
    'label': 'Ember.js 1.9.0',
    'group': 'Ember'
  },
  {
    'url': '//builds.emberjs.com/tags/v1.0.0-beta.16/ember-data.js',
    'label': 'Ember Data 1.0.0-beta.16',
    'group': 'Ember'
  },
  {
    'url': 'https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.2/normalize.min.css',
    'label': 'Normalize.css 3.0.2'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/es5-shim/2.0.8/es5-shim.min.js',
    'label': 'ES5 shim 2.0.8'
  },
  {
    'url': [
      '//extjs.cachefly.net/ext-3.1.0/resources/css/ext-all.css',
      '//cdnjs.cloudflare.com/ajax/libs/ext-core/3.1.0/ext-core.min.js'
    ],
    'label': 'ext-core 3.1.0'
  },
  {
    'url': [
      '//cdnjs.cloudflare.com/ajax/libs/foundation/5.0.3/css/normalize.min.css',
      '//cdnjs.cloudflare.com/ajax/libs/foundation/5.0.3/css/foundation.min.css',
      '//cdnjs.cloudflare.com/ajax/libs/foundation/5.0.3/js/vendor/jquery.min.js',
      '//cdnjs.cloudflare.com/ajax/libs/foundation/5.0.3/js/foundation.min.js'
    ],
    'label': 'Foundation 5.0.3'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0/handlebars.js',
    'label': 'Handlebars.js 1.0.0'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/knockout/3.0.0/knockout-min.js',
    'label': 'Knockout 3.0.0'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/less.js/1.3.3/less.min.js',
    'label': 'Less 1.3.3'
  },
  {
    'url': 'https://rawgit.com/lodash/lodash/3.0.1/lodash.min.js',
    'label': 'lodash 3.0.1'
  },
  {
    'url': 'http://modernizr.com/downloads/modernizr-latest.js',
    'label': 'Modernizr Development latest'
  },
  {
    'url': [
      '//cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js',
      '//cdnjs.cloudflare.com/ajax/libs/detectizr/1.5.0/detectizr.min.js'
    ],
    'label': 'Detectizr 1.5.0'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js',
    'label': 'Prefixfree 1.0.7'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/processing.js/1.4.1/processing-api.min.js',
    'label': 'Processing 1.4.1'
  },
  {
    'url': 'http://d3js.org/d3.v3.min.js',
    'label': 'D3 3.x'
  },
  {
    'url': '//code.highcharts.com/highcharts.js',
    'label': 'Highcharts latest'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js',
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
    'url': '//cdnjs.cloudflare.com/ajax/libs/sammy.js/0.7.4/sammy.min.js',
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
      '//code.jquery.com/jquery.min.js',
      '//canjs.com/release/2.0.3/can.jquery.min.js'
    ],
    'label': 'CanJS 2.0.3'
  },
  {
    'url':[
      '//cdnjs.cloudflare.com/ajax/libs/three.js/r67/three.min.js'
    ],
    'label': 'Three.js r67'
  },
  {
    'url':[
      '//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.6.2/html5shiv.js'
    ],
    'label': 'HTML5 shiv'
  },
  {
    'url': [
      '//cdnjs.cloudflare.com/ajax/libs/polymer/0.3.3/platform.js',
      '//cdnjs.cloudflare.com/ajax/libs/polymer/0.3.3/polymer.js'
    ],
    'label': 'Polymer 0.3.3'
  },
  {
    'url': '//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css',
    'label': 'Font Awesome 4.0.3'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/paper.js/0.9.12/paper.js',
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
    'url': '//cdnjs.cloudflare.com/ajax/libs/gsap/1.11.7/TweenMax.min.js',
    'label': 'GSAP 1.11.7'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/phaser/2.0.5/phaser.min.js',
    'label': 'Phaser 2.0.5'
  },
  {
    'url': [
      '//vjs.zencdn.net/4.12/video-js.css',
      '//vjs.zencdn.net/4.12/video.js'
    ],
    'label': 'Video.js 4.12.x'
  },
  {
    'url': [
      '//aui-cdn.atlassian.com/aui-adg/5.7.0/js/aui.js',
      '//aui-cdn.atlassian.com/aui-adg/5.7.0/css/aui.css',
      '//aui-cdn.atlassian.com/aui-adg/5.7.0/js/aui-experimental.js',
      '//aui-cdn.atlassian.com/aui-adg/5.7.0/css/aui-experimental.css'
    ],
    'label': 'AUI (Atlassian UI) 5.7.0'
  },
  {
    'url': '//cdn.firebase.com/js/client/2.0.2/firebase.js',
    'label': 'Firebase 2.0.2'
  },
  {
    'url': [
      '//code.ionicframework.com/1.0.0-beta.13/js/ionic.bundle.min.js',
      '//code.ionicframework.com/1.0.0-beta.13/css/ionic.min.css'
    ],
    'label': 'Ionic 1.0.0-beta-13'
  },
  {
    'url': '//static.opentok.com/webrtc/v2.2/js/opentok.min.js',
    'label': 'OpenTok 2.2'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/rxjs/2.3.22/rx.all.js',
    'label': 'rx.all',
    'group': 'RxJS'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/rxjs/2.3.22/rx.testing.js',
    'label': 'rx.testing',
    'group': 'RxJS'
  },
  {
    'url': '//cdnjs.cloudflare.com/ajax/libs/rxjs-dom/2.0.7/rx.dom.js',
    'label': 'rx.dom',
    'group': 'RxJS'
  },
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
