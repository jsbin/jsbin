//= require "codemirror"
//= require "mobileCodeMirror"
//= require "library"
//= require "unsaved"
//= require "panel"
//= require "../render/live"
//= require "../render/console"

var panels = {};


panels.getVisible = function () {
  var panels = this.panels,
      visible = [];
  for (var panel in panels) {
    if (panels[panel].visible) visible.push(panels[panel]);
  }
  return visible;
};

panels.save = function () {
  var visible = this.getVisible(),
      state = {},
      panel;

  for (var i = 0; i < visible.length; i++) {
    panel = visible[i];
    state[panel.name] = panel.$el.css('left');
  }

  localStorage.setItem('jsbin.panels', JSON.stringify(state));
}

panels.restore = function () {
  // if there are panel names on the hash (v2 of jsbin) or in the jquery (v3)
  // then restore those specific panels and evenly distribute them.
  var open = [],
      location = window.location,
      toopen = (location.search.substring(1) ? location.search.substring(1) : location.hash.substring(1)).split(','),
      state = {};
      name = '',
      panel = null,
      innerWidth = window.innerWidth;

  // otherwise restore the user's regular settings

  // also set a flag indicating whether or not we should save the panel settings
  // this is based on whether they're on jsbin.com or if they're on an existing
  // bin. Also, if they hit save - *always* save their layout.
  if (location.pathname && location.pathname !== '/') {
    panels.saveOnExit = false;
  } else {
    panels.saveOnExit = true;
  }
  // TODO decide whether the above code I'm trying too hard.

  /* Boot code */
  // then allow them to view specific panels based on comma separated hash fragment
  if (toopen.length) {
    for (var i = 0; i < toopen.length; i++) {
      if (panels.panels[toopen[i]]) panels.panels[toopen[i]].show();
    }

    // support the old jsbin v1 links directly to the preview
    if (toopen.length === 1 && toopen[0] === 'preview') {
      panels.panels.live.show();
    }

    this.distribute();
  } else {
    state = JSON.parse(localStorage.getItem('jsbin.panels') || '{}');
    for (name in state) {
      panels.panels[name].show(innerWidth * parseFloat(state[name]) / 100);
    }
  }

  // now restore any data from sessionStorage
  // TODO add default templates somewhere
  var template = {};
  for (name in this.panels) {
    panel = this.panels[name];
    if (panel.editor) {
      panel.setCode(sessionStorage.getItem('jsbin.content.' + name) || template[name]);
    }
  }

};

panels.savecontent = function () {
  // loop through each panel saving it's content to sessionStorage
  var name, panel;
  for (name in this.panels) {
    panel = this.panels[name];
    if (panel.editor) sessionStorage.setItem('jsbin.content.' + name, panel.getCode());
  }
};

panels.focus = function (panel) {
  this.focused = panel;
  if (panel) {
    $('.panel > .label').removeClass('focus');
    panel.$el.find('.label').addClass('focus');
  }
}

// evenly distribute the width of all the visible panels
panels.distribute = function () {
  var visible = panels.getVisible(),
      width = 100,
      innerWidth = window.innerWidth,
      left = 0,
      right = 0;

  if (visible.length) {
    visible = visible.sort(function (a, b) {
      return a.order < b.order ? -1 : 1;
    });

    width = 100 / visible.length;
    for (var i = 0; i < visible.length; i++) {
      right = 100 - (width * (i+1));
      visible[i].$el.css({ top: 0, bottom: 0, left: left + '%', right: right + '%' });
      visible[i].splitter.trigger('init', innerWidth * left/100);
      visible[i].splitter[i == 0 ? 'hide' : 'show']();
      left += width;
    }
  }
};

panels.show = function (panelId) {
  this.panels[panelId].show();
  if (this.panels[panelId].editor) {
    this.panels[panelId].editor.focus();
  }
}

// dirty, but simple
Panel.prototype.distribute = function () {
  panels.distribute();
};

jsbin.panels = panels;

var editors = panels.panels = {
  javascript: new Panel('javascript', { editor: true, label: 'JavaScript', nosplitter: true }),
  css: new Panel('css', { editor: true, label: 'CSS' }),
  html: new Panel('html', { editor: true, label: 'HTML' }),
  console: new Panel('console', { label: 'Console' }),
  live: new Panel('live', { label: 'Live Preview', show: function () {
    // contained in live.js
    $(document).bind('codeChange.live', throttledPreview);
    renderLivePreview();
  }})
};

editors.live.settings.render = function () {
  editors.console.render();
  renderLivePreview();
};

// IMPORTANT this is nasty, but the sequence is important, because the
// show/hide method is being called as the panels are being called as
// the panel is setup - so we hook these handlers on *afterwards*.
panels.update = function () {
  var visiblePanels = panels.getVisible(),
      visible = [],
      i = 0;
  for (i = 0; i < visiblePanels.length; i++) {
    visible.push(visiblePanels[i].name);
  }

  if (history.replaceState) {
    history.replaceState(null, null, '?' + visible.join(','));
  } else {
    // :( this will break jquery mobile - but we're talking IE only at this point, right?
    location.hash = '#' + visible.join(',');
  }
}


Panel.prototype._show = Panel.prototype.show;
Panel.prototype.show = function () { 
  this._show.apply(this, arguments);
  panels.update();
}

Panel.prototype._hide = Panel.prototype.hide;
Panel.prototype.hide = function () { 
  this._hide.apply(this, arguments);
  panels.update();
}



panels.restore();
panels.focus(panels.getVisible()[0] || null);


var editorsReady = setInterval(function () {
  var ready = true;
  for (var panel in panels.panels) {
    if (!panels.panels[panel].ready) ready = false;
  }

  if (ready) {
    clearInterval(editorsReady);
    // panels.ready = true;
    // if (typeof editors.onReady == 'function') editors.onReady();

    $(window).resize(function () {
      setTimeout(function () {
        $document.trigger('sizeeditors');
      }, 100);
    });

    $document.trigger('sizeeditors');
    $document.trigger('jsbinReady');
  }
}, 100);

//= require "keycontrol"
