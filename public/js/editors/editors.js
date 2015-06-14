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
  // don't save panel state if we're in embed mode
  if (jsbin.embed) {
    return;
  }

  var visible = this.getVisible(),
      state = {},
      panel,
      left = '',
      width = $window.width();

  for (var i = 0; i < visible.length; i++) {
    panel = visible[i];
    left = panel.$el.css('left');
    if (left.indexOf('%') === -1) {
      // convert the pixel to relative - this is because jQuery pulls
      // % for Webkit based, but px for Firefox & Opera. Cover our bases
      left = (parseFloat(left)  / width * 100) + '%';
    }
    state[panel.name] = left;
  }

  store.sessionStorage.setItem('jsbin.panels', JSON.stringify(state));
};

function getQuery(qs) {
  /*globals $*/
  var sep = '&';
  var eq = '=';
  var obj = {};

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    try {
      k = decodeURIComponent(kstr);
      v = decodeURIComponent(vstr);
    } catch (e) {
      k = kstr;
      v = vstr;
    }

    if (!(window.hasOwnProperty ? window.hasOwnProperty(obj, k) : obj.hasOwnProperty(k))) {
      obj[k] = v;
    } else if ($.isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
}

function stringAsPanelsToOpen(query) {
  var validPanels = ['live', 'javascript', 'html', 'css', 'console'];

  return query.split(',').reduce(function (toopen, key) {
    if (key === 'js') {
      key = 'javascript';
    }

    if (key === 'output') {
      key = 'live';
    }

    if (validPanels.indexOf(key) !== -1) {
      toopen.push(key);
    }

    return toopen;
  }, []);
}

panels.restore = function () {
  'use strict';
  /*globals jsbin, editors, $window, $document*/
  // if there are panel names on the hash (v2 of jsbin) or in the query (v3)
  // then restore those specific panels and evenly distribute them.
  var open = [],
      defaultPanels = ['html', 'live'], // sigh, live == output :(
      location = window.location,
      search = location.search.substring(1),
      hash = location.hash.substring(1),
      toopen = [],
      state = jsbin.embed ? null : JSON.parse(store.sessionStorage.getItem('jsbin.panels') || 'null'),
      hasContent = { javascript: editors.javascript.getCode().length,
        css: editors.css.getCode().length,
        html: editors.html.getCode().length
      },
      name = '',
      i = 0,
      panel = null,
      init = [],
      panelURLValue = '',
      openWithSameDimensions = false,
      width = $window.width(),
      deferredCodeInsert = '',
      focused = !!store.sessionStorage.getItem('panel'),
      validPanels = 'live javascript html css console'.split(' '),
      cachedHash = '';

  if (history.replaceState && (location.pathname.indexOf('/edit') !== -1) || ((location.origin + location.pathname) === jsbin.getURL() + '/')) {
    // history.replaceState(null, '', jsbin.getURL() + (jsbin.getURL() === jsbin.root ? '' : '/edit') + (hash ? '#' + hash : ''));
  }

  if (search || hash) {
    var query = (search || hash);

    // assume the query is: html=xyz
    if (query.indexOf('&') !== -1) {
      query = getQuery(search || hash);
      toopen = Object.keys(query).reduce(function (toopen, key) {
        if (key.indexOf(',') !== -1 && query[key] === '') {
          toopen = stringAsPanelsToOpen(key);
          return toopen;
        }

        if (key === 'js') {
          query.javascript = query.js;
          key = 'javascript';
        }

        if (key === 'output') {
          query.live = query.live;
          key = 'live';
        }

        if (query[key] === undefined) {
          query[key] = '';
        }

        if (validPanels.indexOf(key) !== -1) {
          toopen.push(key + '=' + query[key]);
        }

        return toopen;
      }, []);
    } else {
      toopen = stringAsPanelsToOpen(query);
    }
  }

  if (toopen.length === 0) {
    if (state !== null) {
      toopen = Object.keys(state);
    }
    else {
      // load from personal settings
      toopen = jsbin.settings.panels;
    }
  }

  if (toopen.length === 0) {
    if (hasContent.javascript) {toopen.push('javascript');}
    if (hasContent.html) {toopen.push('html');}
    if (hasContent.css) {toopen.push('css');}
    toopen.push('live');
  }

  panels.saveOnExit = true;

  /* Boot code */
  // then allow them to view specific panels based on comma separated hash fragment/query
  i = 0;

  if (toopen.length === 0) {
    toopen = defaultPanels;
  }

  if (toopen.length) {
    for (name in state) {
      if (toopen.indexOf(name) !== -1) {
        i++;
      }
    }

    if (i === toopen.length) {
      openWithSameDimensions = true;
    }

    for (i = 0; i < toopen.length; i++) {
      panelURLValue = null;
      name = toopen[i];

      // if name contains an `=` it means we also need to set that particular panel to that code
      if (name.indexOf('=') !== -1) {
        panelURLValue = name.substring(name.indexOf('=') + 1);
        name = name.substring(0, name.indexOf('='));
      }

      if (panels.panels[name]) {
        panel = panels.panels[name];
        // console.log(name, 'width', state[name], width * parseFloat(state[name]) / 100);
        if (panel.editor && panelURLValue !== null) {
          panel.setCode(decodeURIComponent(panelURLValue));
        }

        if (openWithSameDimensions && toopen.length > 1) {
          panel.show(width * parseFloat(state[name]) / 100);
        } else {
          panel.show();
        }
        init.push(panel);
      } else if (name && panelURLValue !== null) { // TODO support any varible insertion
        (function (name, panelURLValue) {
          var todo = ['html', 'javascript', 'css'];

          var deferredInsert = function (event, data) {
            var code, parts, panel = panels.panels[data.panelId] || {};

            if (data.panelId && panel.editor && panel.ready === true) {
              todo.splice(todo.indexOf(data.panelId), 1);
              try {
                code = panel.getCode();
              } catch (e) {
                // this really shouldn't happen
                // console.error(e);
              }
              if (code.indexOf('%' + name + '%') !== -1) {
                parts = code.split('%' + name + '%');
                code = parts[0] + decodeURIComponent(panelURLValue) + parts[1];
                panel.setCode(code);
                $document.unbind('codeChange', deferredInsert);
              }
            }

            if (todo.length === 0) {
              $document.unbind('codeChange', deferredInsert);
            }
          };

          $document.bind('codeChange', deferredInsert);
        }(name, panelURLValue));
      }
    }

    // support the old jsbin v1 links directly to the preview
    if (toopen.length === 1 && toopen[0] === 'preview') {
      panels.panels.live.show();
    }

    if (!openWithSameDimensions) {this.distribute();}
  }

  // now restore any data from sessionStorage
  // TODO add default templates somewhere
  // var template = {};
  // for (name in this.panels) {
  //   panel = this.panels[name];
  //   if (panel.editor) {
  //     // panel.setCode(store.sessionStorage.getItem('jsbin.content.' + name) || template[name]);
  //   }
  // }

  for (i = 0; i < init.length; i++) {
    init[i].init();
  }

  var visible = panels.getVisible();
  if (visible.length) {
    $body.addClass('panelsVisible');
    if (!focused) {
      visible[0].show();
    }
  }

};

panels.savecontent = function () {
  // loop through each panel saving it's content to sessionStorage
  var name, panel;
  for (name in this.panels) {
    panel = this.panels[name];
    if (panel.editor) store.sessionStorage.setItem('jsbin.content.' + name, panel.getCode());
  }
};

panels.getHighlightLines = function () {
  'use strict';
  var hash = [];
  var lines = '';
  var panel;
  for (name in panels.panels) {
    panel = panels.panels[name];
    if (panel.editor) {
      lines = panel.editor.highlightLines().string;
      if (lines) {
        hash.push(name.substr(0, 1).toUpperCase() + ':L' + lines);
      }
    }
  }
  return hash.join(',');
};

panels.focus = function (panel) {
  this.focused = panel;
  if (panel) {
    $('.panel').removeClass('focus').filter('.' + panel.id).addClass('focus');
  }
}

panels.getQuery = function () {
  var alt = {
    javascript: 'js',
    live: 'output'
  };

  var visible = panels.getVisible();

  return visible.map(function (p) {
    return alt[p.id] || p.id;
  }).join(',');
}

panels.updateQuery = throttle(function updateQuery() {
  var query = panels.getQuery();

  if (jsbin.state.code && jsbin.state.owner) {
    $.ajax({
      url: jsbin.getURL({ withRevision: true }) + '/settings',
      type: 'PUT',
      data: { panels: visible.map(function (p) { return p.id; }) },
      success: function () {}
    });
  }

  if (history.replaceState) {
    history.replaceState(null, null, '?' + query);
  }
}, 100);

var userResizeable = !$('html').hasClass('layout');

if (!userResizeable) {
  $('#source').removeClass('stretch');
}

// evenly distribute the width of all the visible panels
panels.distribute = function () {
  if (!userResizeable) {
    return;
  }

  var visible = $('#source .panelwrapper:visible'),
      width = 100,
      height = 0,
      innerW = $window.width() - (visible.length - 1), // to compensate for border-left
      innerH = $('#source').outerHeight(),
      left = 0,
      right = 0,
      top = 0,
      panel,
      nestedPanels = [];

  if (visible.length) {
    $body.addClass('panelsVisible');

    // visible = visible.sort(function (a, b) {
    //   return a.order < b.order ? -1 : 1;
    // });

    width = 100 / visible.length;
    for (var i = 0; i < visible.length; i++) {
      panel = $.data(visible[i], 'panel');
      right = 100 - (width * (i+1));
      panel.$el.css({ top: 0, bottom: 0, left: left + '%', right: right + '%' });
      panel.splitter.trigger('init', innerW * left/100);
      panel.splitter[i == 0 ? 'hide' : 'show']();
      left += width;

      nestedPanels = $(visible[i]).find('.panel');
      if (nestedPanels.length > 1) {
        top = 0;
        nestedPanels = nestedPanels.filter(':visible');
        height = 100 / nestedPanels.length;
        nestedPanels.each(function (i) {
          bottom = 100 - (height * (i+1));
          var panel = jsbin.panels.panels[$.data(this, 'name')];
          // $(this).css({ top: top + '%', bottom: bottom + '%' });
          $(this).css('top', top + '%');
          $(this).css('bottom', bottom + '%' );
          if (panel.splitter.hasClass('vertical')) {
            panel.splitter.trigger('init', innerH * top/100);
            panel.splitter[i == 0 ? 'hide' : 'show']();
          }
          top += height;
        });
      }
    }
  } else if (!jsbin.embed) {
    $('#history').show();
    setTimeout(function () {
      $body.removeClass('panelsVisible');
    }, 100); // 100 is on purpose to add to the effect of the reveal
  }
};

panels.show = function (panelId) {
  this.panels[panelId].show();
  if (this.panels[panelId].editor) {
    this.panels[panelId].editor.focus();
  }
  this.panels[panelId].focus();
};

panels.hide = function (panelId) {
  var $history = $('#history'); // TODO shouldn't have to keep hitting this
  var panels = this.panels;
  if (panels[panelId].visible) {
    panels[panelId].hide();
  }

  var visible = jsbin.panels.getVisible();
  if (visible.length) {
    jsbin.panels.focused = visible[0];
    if (jsbin.panels.focused.editor) {
      jsbin.panels.focused.editor.focus();
    } else {
      jsbin.panels.focused.$el.focus();
    }
    jsbin.panels.focused.focus();
  }

  /*
  } else if ($history.length && !$body.hasClass('panelsVisible')) {
    $body.toggleClass('dave', $history.is(':visible'));
    $history.toggle(100);
  } else if ($history.length === 0) {
    // TODO load up the history
  }
  */
};

panels.hideAll = function () {
  var visible = panels.getVisible(),
      i = visible.length;
  while (i--) {
    visible[i].hide();
  }
};

// dirty, but simple
Panel.prototype.distribute = function () {
  panels.distribute();
};

jsbin.panels = panels;

var ignoreDuringLive = /^\s*(while|do|for)[\s*|$]/;


var panelInit = {
  html: function () {
    var init = function () {
      // set cursor position on first blank line
      // 1. read all the inital lines
      var lines = this.editor.getValue().split('\n'),
          blank = -1;
      lines.forEach(function (line, i) {
        if (blank === -1 && line.trim().length === 0) {
          blank = i;
          //exit
        }
      });

      if (blank !== -1) {
        this.editor.setCursor({ line: blank, ch: 2 });
        if (lines[blank].length === 0) {
          this.editor.indentLine(blank, 'add');
        }
      }
    };

    return new Panel('html', { editor: true, label: 'HTML', init: init });
  },
  css: function () {
    return new Panel('css', { editor: true, label: 'CSS' });
  },
  javascript: function () {
    return new Panel('javascript', { editor: true, label: 'JavaScript' });
  },
  console: function () {
    // hide and show callbacks registered in console.js
    return new Panel('console', { label: 'Console' });
  },
  live: function () {
    function show() {
      // var panel = this;
      if (panels.ready) {
        renderLivePreview();
      }
    }

    function hide() {
      // detroy the iframe if we hide the panel
      // note: $live is defined in live.js
      // Commented out so that the live iframe is never destroyed
      if (panels.panels.console.visible === false) {
        // $live.find('iframe').remove();
      }
    }

    return new Panel('live', { label: 'Output', show: show, hide: hide });
  }
};

var editors = panels.panels = {};

// show all panels (change the order to control the panel order)
editors.html = panelInit.html();
editors.css = panelInit.css();
editors.javascript = panelInit.javascript();
editors.console = panelInit.console();
upgradeConsolePanel(editors.console);
editors.live = panelInit.live();

// jsconsole.init(); // sets up render functions etc.
editors.live.settings.render = function (showAlerts) {
  if (panels.ready) {
    renderLivePreview(showAlerts);
  }
};

panels.allEditors = function (fn) {
  var panelId, panel;
  for (panelId in panels.panels) {
    panel = panels.panels[panelId];
    if (panel.editor) fn(panel);
  }
};

setTimeout(function () {
  panels.restore();
}, 10);
panels.focus(panels.getVisible()[0] || null);

var editorsReady = setInterval(function () {
  var ready = true,
      resizeTimer = null,
      panel,
      panelId,
      hash = window.location.hash.substring(1);


  for (panelId in panels.panels) {
    panel = panels.panels[panelId];
    if (panel.visible && !panel.ready) {
      ready = false;
      break;
    }
  }

  panels.ready = ready;

  if (ready) {
    panels.allEditors(function (panel) {
      var key = panel.id.substr(0, 1).toUpperCase() + ':L';
      if (hash.indexOf(key) !== -1) {
        var lines = hash.match(new RegExp(key + '(\\d+(?:-\\d+)?)'));
        if (lines !== null) {
          panel.editor.highlightLines(lines[1]);
        }
      }
    });

    clearInterval(editorsReady);

    // if the console is visible, it'll handle rendering of the output and console
    if (panels.panels.console.visible) {
      editors.console.render();
    } else {
      // otherwise, force a render
      renderLivePreview();
    }


    $(window).resize(function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        $document.trigger('sizeeditors');
      }, 100);
    });

    $document.trigger('sizeeditors');
    $document.trigger('jsbinReady');
  }
}, 100);
