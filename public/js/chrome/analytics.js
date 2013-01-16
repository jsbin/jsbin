var analytics = {
  libraryMenu: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/open-library-menu']);
  },
  embed: function () {
    window._gaq && _gaq.push(['_trackPageview', '/embed/' + window.top.location.toString()]);
  },
  revert: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/revert' + window.location.pathname]);
  },
  milestone: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/milestone' + window.location.pathname]);
  },
  clone: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/clone' + window.location.pathname]);
  },
  lock: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/lock-revision']);
  },
  openShare: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/open-share']);
  },
  saveTemplate: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/save-template']);
  },
  createNew: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/new']);
  },
  startSaving: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/start-saving']);
  },
  open: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/open']);
  },
  openFromAvatar: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/open-from-avatar']);
  },
  download: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/download' + window.location.pathname]);
  },
  showPanel: function (panelId) {
    window._gaq && _gaq.push(['_trackPageview', '/action/panel/show/' + panelId]);
  },
  hidePanel: function (panelId) {
    window._gaq && _gaq.push(['_trackPageview', '/action/panel/hide/' + panelId]);
  },
  logout: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/logout']);
  },
  login: function (ok) {
    if (window._gaq) {
      if (ok === undefined) {
        _gaq.push(['_trackPageview', '/action/login']);
      } else {
        _gaq.push(['_trackPageview', '/action/login/'  + ok ? 'success' : 'fail']);
      }
    }
  },
  help: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/help']);
  },
  urls: function () {
    window._gaq && _gaq.push(['_trackPageview', '/action/urls']);
  },
  enableLiveJS: function (ok) {
    window._gaq && _gaq.push(['_trackPageview', '/action/live-js/' + ok ? 'on' : 'off']);
  },
  loadGist: function (id) {
    window._gaq && _gaq.push(['_trackPageview', '/action/gist/' + id]);
  },
  layout: function (panelsVisible) {
    var layout = [], panel = '';

    if (window._gaq) {
      for (panel in panelsVisible) {
        layout.push(panel + ':' + panelsVisible[panel]);
      }
      _gaq.push(['_trackPageview', '/action/layout/' + layout.join('/')]);
    }
  }
};

/* TODO
- run js
- run console
- final splitter and panel config & positions!!!
*/
