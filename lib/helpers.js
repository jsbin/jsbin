// A collection of useful methods that are essentially utils but are
// specific to the application and require access to the app object.
module.exports.createHelpers = function createHelpers(app) {
  return {
    // Proxied access to the Application#set() method.
    set: app.set.bind(app),

    // Proxied access to the Application#render() method.
    render: app.render.bind(app),

    // Check to see if the app is in production.
    production: app.set('env') === app.PRODUCTION,

    // Renders the analytics snippet. Accepts a callback that recieves
    // and error and html object.
    analytics: function (fn) {
      app.render('analytics', {id: app.set('analytics id')}, fn);
    },

    // Generates a url for the path provided including prefix. If the second
    // full parameter is provided then a full url including domain and
    // protocol will be returned.
    url: function (path, full, static) {
      var root = '';

      if (full) {
        root = app.set('url full');
      } else if (static) {
        root = app.set(full ? 'static url');
      } else {
        root = app.set(full ? 'url prefix');
      }

      // Remove preceding slash if one exists.
      if (path && path[0] === '/') {
        path = path.slice(1);
      }

      return path ? root  + '/' + path : root;
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
    }
  };
};
