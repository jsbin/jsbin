'use strict';
// A collection of useful methods that are essentially utils but are
// specific to the application and require access to the app object.
var config = require('./config');
var undefsafe = require('undefsafe');
var crypto = require('crypto');

module.exports.createHelpers = function createHelpers(app) {
  return {
    // Proxied access to the Application#set() method.
    set: app.set.bind(app),

    config: config,

    // Proxied access to the Application#render() method.
    render: app.render.bind(app),

    // Check to see if the app is in production.
    production: app.get('env') === app.PRODUCTION,

    is_production: app.get('env') === app.PRODUCTION, // jshint ignore:line

    analyticsId: config.analytics ? config.analytics.id : false,

    // Pre-set the URL used for the runner
    runner: app.set('url runner') + '/runner',

    // Renders the analytics snippet. Accepts a callback that recieves
    // and error and html object.
    renderAnalytics: function (render, fn) {
      if (typeof render === 'function') {
        fn = render;
        render = false;
      }

      // separate the tracking of the application over rendered pages
      if (render) {
        app.render('partials/analytics', function (error, html) {
          if (error) {
            return fn(error);
          }

          // hack :-\ (because the HTML gets cached)
          fn(error, html.replace(config.analytics.id, config.analytics['render-id']));
        });
      } else {
        // this doesn't get called anymore
        app.render('analytics', {id: app.get('analytics id')}, fn);
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
        root = undefsafe(config, 'url.ssl.host') || undefsafe(config, 'url.host');
        root = 'https://' + root;
      }

      return path ? root  + '/' + path : root;
    },

    // matches the format used in the client side code (jsbin.js)
    jsbinURL: function (bin) {
      var url = app.set('url full');

      if (!bin) {
        return;
      }

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

    // Same as helper.urlForBin() but returns an url for the edit page.
    editUrlForBin: function (bin, full) {
      return this.urlForBin(bin, full) + '/edit';
    },

    // Returns a gravatar url for the email address provided. An optional size
    // parameter can be provided to specify the size of the avatar to generate.
    gravatar: function (user, size) {
      var email = (user.email || '').trim().toLowerCase();
      var name = user.name || 'default';

      var d = 'd=blank';
      if (!size || size < 120) {
        d = 'd=' + encodeURIComponent('https://jsbin-gravatar.herokuapp.com/' + name + '.png');
      }

      var hash = crypto.createHash('md5').update(email).digest('hex');
      return user.email ? 'https://www.gravatar.com/avatar/' + hash + '?s=' + (size || 29) + '&' + d : user.avatar;
    },

    // Returns a url for a static resource.
    urlForStatic: function (path, secure) {
      var root = app.get('static url').replace(/.*:\/\//, '');
      var proto = 'http';

      if (path && path[0] === '/') {
        path = path.slice(1);
      }

      if (secure) {
        root = undefsafe(config, 'url.ssl.static') || undefsafe(config, 'url.static') || undefsafe(config, 'url.host');
        proto = 'https';
      }

      return path ? proto + '://' + root + '/' + (path || '') : proto + '://' + root;
    }
  };
};
