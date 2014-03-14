(function () {
  /*global $:true, jsbin:true, sharejs:true, editors:true*/
  'use strict';

  if (typeof sharejs !== 'undefined') {
    window.ShareJS = function() {
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
      var registerConnection = function() {
        if (connection.html) {
          register('ok', '#46a546', 'ok');
          register('connecting', '#f89406', 'connecting');
          register('disconnected', '#c43c35', 'disconnected');
          register('stopped', '#c43c35', 'stopped');
        }
      };

      this.closeConnection = function() {
        if (connection.html) { connection.html.disconnect(); }
        if (connection.css) { connection.css.disconnect(); }
        if (connection.javascript) { connection.javascript.disconnect(); }
      };

      function open(what) {
        console.log(editors);
        var ed = editors[what].editor;
        var realTxt = ed.getValue();
        connection[what] = sharejs.open(sessionIdVal + '_' + what, 'text', options, function(error, newDoc) {
          if (error) {
            console.log(error);
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

      this.openSession = function() {
        this.closeConnection();
        sessionIdVal = '1';

        open('html');
        open('css');
        open('javascript');
        
        registerConnection();
      };
    };
  }
})();