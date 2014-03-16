(function () {
  /*global $:true, jsbin:true, sharejs:true, editors:true*/
  'use strict';
  if (window.location.hash.indexOf('sharejs=') !== -1) {
    jsbin.saveDisabled = true;
    jsbin.sandbox = true;
    jsbin.sharejs = true;
    jsbin.sharejsSession = window.location.hash.replace('#&sharejs=', '');
  }

  window.ShareJs = function() {
    var options = {
      // origin: window.location.origin + '/channel'
      origin: 'http://localhost:5000/channel'
    };
    var doc = {
        html: null,
        css: null,
        javascript: null
      },
      connection = {
        html: null,
        css: null,
        javascript: null
      },
      sessionIdVal;

    //status
    var sessionStatusLabel = $('<span id="sessionStatusLabel" style="position:absolute;left:0;bottom:0;z-index:9999999999999">disconnected</span>');
    $('body').append(sessionStatusLabel);
    var register = function(state, klass, text) {
      connection.html.on(state, function() {
        sessionStatusLabel.html('Status: ' + text);
        sessionStatusLabel.css('background', klass);
      });
    };
    var registerConnection = function(show) {
      if (connection.html) {
        register('ok', '#46a546', 'ok');
        register('connecting', '#f89406', 'connecting');
        register('disconnected', '#c43c35', 'disconnected');
        register('stopped', '#c43c35', 'stopped');
        if (show === true) {
          console.log('======> ' + window.location.href + '#&sharejs=' + jsbin.sharejsSession);
        }
      }
    };

    this.closeConnection = function() {
      if (connection.html) { connection.html.disconnect(); }
      if (connection.css) { connection.css.disconnect(); }
      if (connection.javascript) { connection.javascript.disconnect(); }
    };

    function open(what) {
      var ed = editors[what].editor;
      var realTxt = ed.getValue();
      connection[what] = sharejs.open(sessionIdVal + '_' + what, 'text', options, function(error, newDoc) {
        if (error) {
          // console.log(error);
        }
        else {
          doc[what] = newDoc;
          doc[what].attach_cm(ed);

          if (doc[what].snapshot === '') {
            ed.setValue(realTxt);
          }
        }
      });
    }

    function generateId(length) {
      length = length || 10;
      var letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV0123456789';
      var s = '';
      for (var i=0; i<length; i++) {
        s += letters.charAt(Math.floor(Math.random() * letters.length));
      }
      return s;
    }

    this.openSession = function() {
      this.closeConnection();
      var show = false;
      if (typeof jsbin.sharejsSession === 'undefined') {
        jsbin.sharejsSession = generateId();
        show = true;
      }
      sessionIdVal = jsbin.sharejsSession;

      open('html');
      open('css');
      open('javascript');
      
      registerConnection(show);
    };
  };

  function load(url) {
    var $body = $('body');
    var d = $.Deferred();
    setTimeout(function () {
      $body.append('<script src="' + url + '"></script>');
      d.resolve();
    }, 0);
    return d;
  }

  function ready() {
    var d = $.Deferred();
    var timer = null;

    if (typeof sharejs !== 'undefined') {
      d.resolve();
    } else {
      timer = setInterval(function () {
        if (typeof sharejs !== 'undefined') {
          clearInterval(timer);
          d.resolve();
        }
      }, 100);
    }

    return d;
  }

  function loadUrl(url) {
    $.when.call($, load(url)).done(function () {
      ready().then(function () {
        window.sharejsSession = new ShareJs();
        sharejsSession.openSession();
      });
    });
  }

  window.openShareJs = function() {
    // To avoid the loading of too many files and some errors, on the
    // sharejs server I created a minified unified version of all the
    // necessary files
    var urls = [
      'http://localhost:5000/channel/bcsocket.js'
      // 'http://localhost:5000/share/share.js',
      // 'http://localhost:5000/share/cm.js',
      // 'http://localhost:5000/share/textarea.js',
      // 'http://localhost:5000/share/json.js"'
      // 'http://localhost:5000/share/giulia.js"'
    ];
    if (typeof sharejs === 'undefined') {
      urls.forEach(loadUrl);
    }
    else {
      window.sharejsSession = new ShareJs();
      sharejsSession.openSession();
    }
    var $b = $('#sharejs-jsbin-button');
    $b.html( $b.attr('data-end-sharejs-html') );
    $b.removeAttr('onclick');
    $b.on('click', function(e) {
      e.preventDefault();
      closeShareJs();
    });
    jsbin.collaborating = true;
  };

  window.closeShareJs = function() {
    if (typeof sharejs !== 'undefined' && sharejsSession) {
      sharejsSession.closeConnection();
      window.location.reload();
    }
  };

  window.startShareJs = function() {
    openShareJs();
  };
})();