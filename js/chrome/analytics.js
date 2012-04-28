var analytics = {
  revert: function () {
    window._gaq && _gaq.push(['_trackPageview', '/revert' + window.location.pathname]);
  },
  save: function () {
    window._gaq && _gaq.push(['_trackPageview', '/save' + window.location.pathname]);
  },
  clone: function () {
    window._gaq && _gaq.push(['_trackPageview', '/clone' + window.location.pathname]);
  }
  saveTemplte: function () {
    window._gaq && _gaq.push(['_trackPageview', '/save-template']);
  },
  createNew: function () {
    window._gaq && _gaq.push(['_trackPageview', '/new']);
  },
  open: function () {
    window._gaq && _gaq.push(['_trackPageview', '/open']);
  },
  download: function () {
    window._gaq && _gaq.push(['_trackPageview', '/download' + window.location.pathname]);
  },
  showPanel: function (panelId) {
    window._gaq && _gaq.push(['_trackPageview', '/panel/show/' + panelId]);
  },
  hidePanel: function (panelId) {
    window._gaq && _gaq.push(['_trackPageview', '/panel/hide/' + panelId]);
  },
  logout: function () {
    window._gaq && _gaq.push(['_trackPageview', '/logout']);
  },
  login: function (ok) {
    if (window._gaq) {
      if (ok === undefined) {
        _gaq.push(['_trackPageview', '/login']);
      } else {
        _gaq.push(['_trackPageview', '/login/'  + ok ? 'success' : 'fail']);
      }
    }
  },
  help: function () {
    window._gaq && _gaq.push(['_trackPageview', '/help']);
  },
  enableLiveJS: function (ok) {
    window._gaq && _gaq.push(['_trackPageview', '/live-js/' + ok ? 'on' : 'off']);
  },
  loadGist: function (id) {
    window._gaq && _gaq.push(['_trackPageview', '/gist/' + id]);
  }
};

/* TODO
- run js
- run console

*/