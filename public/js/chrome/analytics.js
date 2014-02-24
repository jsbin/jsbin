var analytics = {
  track: function (category, action, label, value) {
    var data = ['_trackEvent', category, action];
    if (label) {
      data.push(label);
    }
    if (value) {
      data.push(value);
    }

    // console.log(data, (new Error()).stack);
    window._gaq && _gaq.push(data);
  },
  library: function (action, value) {
    analytics.track('menu', action, 'library', value);
  },
  embed: function () {
    analytics.track('state', 'embed');
    try {
      analytics.track('state', 'embed', window.top.location);
    } catch (e) {};
  },
  milestone: function () {
    analytics.track('bin', 'save', window.location.pathname);
  },
  clone: function () {
    analytics.track('bin', 'clone', window.location.pathname);
  },
  lock: function () {
    analytics.track('bin', 'lock', window.location.pathname);
  },
  openShare: function () {
    analytics.track('menu', 'open', 'share');
  },
  saveTemplate: function () {
    analytics.track('menu', 'select', 'save-template');
  },
  createNew: function (from) {
    analytics.track(from || 'menu', 'select', 'new');
  },
  open: function (from) {
    analytics.track(from || 'menu', 'select', 'open');
  },
  openFromAvatar: function () {
    analytics.track('menu', 'select', 'open via avatar');
  },
  openMenu: function (label) {
    analytics.track('menu', 'open', label);
  },
  closeMenu: function (label) {
    analytics.track('menu', 'close', label);
  },
  selectMenu: function (item) {
    if (item) {
      analytics.track('menu', 'select', item);
    }
  },
  share: function (action, label) {
    analytics.track('share', action, label);
  },
  download: function (from) {
    analytics.track(from || 'menu', 'select', 'download');
  },
  showPanel: function (panelId) {
    analytics.track('panel', 'show', panelId);
  },
  hidePanel: function (panelId) {
    analytics.track('panel', 'hide', panelId);
  },
  logout: function () {
    analytics.track('menu', 'select', 'logout');
  },
  register: function (success) {
    if (success === undefined) {
      analytics.track('menu', 'open', 'login');
    } else {
      analytics.track('user', 'register', ok ? 'success' : 'fail');
    }
  },
  login: function (ok) {
    if (ok === undefined) {
      analytics.track('menu', 'open', 'login');
    } else {
      analytics.track('user', 'login', ok ? 'success' : 'fail');
    }
  },
  enableLiveJS: function (ok) {
    analytics.track('button', 'auto-run js', ok ? 'on' : 'off');
  },
  archiveView: function (visible) {
    analytics.track('button', 'view archive', visible ? 'on' : 'off');
  },
  archive: function (url) {
    analytics.track('button', 'archive', url);
  },
  unarchive: function (url) {
    analytics.track('button', 'unarchive', url);
  },
  loadGist: function (id) {
    analytics.track('state', 'load gist', id);
  },
  layout: function (panelsVisible) {
    var layout = [], panel = '';

    for (panel in panelsVisible) {
      layout.push(panel.id);
    }

    analytics.track('layout', 'update', layout.sort().join(',') || 'none');
  },
  run: function (from) {
    analytics.track(from || 'button', 'run with js');
  },
  runconsole: function (from) {
    analytics.track(from || 'button', 'run console');
  }
};

/* TODO
- run js
- run console
- final splitter and panel config & positions!!!
*/
