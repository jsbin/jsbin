// A collection of useful methods that are essentially utils but are
// specific to the application and require access to the app object.
var config = require('./config');
var custom = require('./custom');
var _ = require('underscore');
module.exports = function createHelpers(app) {
  'use strict';
  app.locals({
    // Proxied access to the Application#set() method.
    set: app.set.bind(app),

    // Proxied access to the Application#render() method.
    render: app.render.bind(app),

    // Check to see if the app is in production.
    production: app.get('env') === app.PRODUCTION,


    // Pre-set the URL used for the runner
    runner: app.set('url runner') + '/runner',

    // Gets the custom css and js for subdomains
    getCustomConfig: function(req) {
      var config = req.subdomain ? custom[req.subdomain] || false : false;
      if (!config) {
        return false;
      }
      var cacheBust = (req.cookies && req.cookies.debug ? false : app.locals.production) ? '?' + app.set('version') : '';
      var returnConfig = _.clone(config);
      if (config.css) {
        var cssPath = config.css;
        returnConfig.css = app.locals.urlForStatic(cssPath + cacheBust, req.secure);
      }
      if (config.js) {
        var jsPath = config.js;
        returnConfig.js = app.locals.urlForStatic(jsPath + cacheBust, req.secure);
      }
      return returnConfig;
    },

    // Renders the analytics snippet. Accepts a callback that recieves
    // and error and html object.
    analytics: function (render, fn) {
      if (typeof render === 'function') {
        fn = render;
        render = false;
      }

      // separate the tracking of the application over rendered pages
      if (render) {
        app.render('analytics-render', {id: app.set('analytics render-id')}, fn);
      } else {
        app.render('analytics', {id: app.set('analytics id')}, fn);
      }
    },

    // Generates a url for the path provided including prefix. If the second
    // full parameter is provided then a full url including domain and
    // protocol will be returned.
    url: function (path, full, secure) {
      var root = '';

      if (full) {
        root = app.set('url full');
      } else {
        root = app.set('url prefix');
      }

      // Remove preceding slash if one exists.
      if (path && path[0] === '/') {
        path = path.slice(1);
      }

      if (secure) {
        root = root.replace(/http:/, 'https:');
      }

      return path ? root  + '/' + path : root;
    },

    // matches the format used in the client side code (jsbin.js)
    jsbinURL: function (bin) {
      var url = app.set('url full');

      if (bin.url) {
        url += '/' + bin.url;

        if (bin.revision && bin.revision !== 1) {
          url += '/' + bin.revision;
        }
      }
      return url;
    },

    // Same as helper.url() but creates a url for the bin object provided.
    urlForBin: function (bin, full) {
      var url = [];

      if (bin.url) {
        url.push(bin.url);

        if (bin.revision) {
          url.push(bin.revision);
        }
      }

      return this.url(url.join('/'), full);
    },

    binCode: function(bin) {
      return bin.url || null;
    },

    // Same as helper.urlForBin() but returns an url for the edit page.
    editUrlForBin: function (bin, full) {
      return this.urlForBin(bin, full) + '/edit';
    },

    // Returns a url for a static resource.
    urlForStatic: function (path, secure) {
      var root = app.get('static url').replace(/.*:\/\//, '');
      var proto = 'http';

      if (path && path[0] === '/') {
        path = path.slice(1);
      }

      if (secure) {
        root = config.url.static || config.url.host;
        proto = 'https';
      }

      return path ? proto + '://' + root + '/' + (path || '') : proto + '://' + root;
    }
  });
  return app.locals;
};
