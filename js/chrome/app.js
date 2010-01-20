//= require "storage"
//= require "events"
//= require "navigation"
//= require "save"

var debug = false,
    $bin = $('#bin'),
    loadGist,
    unload = function () {
      sessionStorage.setItem('javascript', editors.javascript.getCode());
      sessionStorage.setItem('html', editors.html.getCode());
      
      var panel = getFocusedPanel();
      sessionStorage.setItem('panel', panel);
      sessionStorage.setItem('line', editors[panel].currentLine());
      sessionStorage.setItem('character', editors[panel].cursorPosition().character);    
    };

// if the user linked directly to #html, initially hide the JS panel
if (window.location.hash == '#html') {
  document.getElementById('bin').className += ' html-only';
}

$(window).unload(unload);

// hack for Opera because the unload event isn't firing to capture the settings, so we put it on a timer
if ($.browser.opera) {
  setInterval(unload, 500);
}

/* Boot code */
if (localStorage && localStorage.getItem('html-only')) {
  $bin.addClass('html-only');
}

// if a gist has been requested, lazy load the gist library and plug it in
if (/gist\/\d+/.test(window.location.pathname) && (!sessionStorage.getItem('javascript') && !sessionStorage.getItem('html'))) {
  window.editors = editors; // needs to be global when the callback triggers to set the content
  loadGist = function () {
    $.getScript('/js/chrome/gist.js', function () {
      window.gist = new Gist(window.location.pathname.replace(/.*?(\d+).*/, "$1"));
    });
  };
  
  if (editors.ready) {
    loadGist();
  } else {
    editors.onReady = loadGist;
  }
}

$(document).bind('codeChange', function (event, revert) {
  if (revert == undefined) {
    revert = false;
  }
  
  if (!revert && !/\*$/.test(document.title)) {
    if (/debug/i.test(document.title)) {
      document.title = 'JS Bin - [unsaved]';
    }
    document.title += '*';
  } else if (revert && /\*$/.test(document.title)) {
    document.title = document.title.replace(/\*$/, '');
  }
});

$('div.label p').click(function () {
  var speed = 150;
  if ($bin.is('.html-only')) {
    // only the html tab could have been clicked
    $bin.find('div.html').animate({ left: '50%', width: '50%' }, speed);
    $bin.find('div.javascript').show().animate({ left: '0%' }, speed, function () {
      $bin.removeClass('html-only');
      localStorage && localStorage.removeItem('html-only');
    });
  } else {
    $bin.find('div.html').animate({ left: '00%', width: '100%' }, speed);
    $bin.find('div.javascript').animate({ left: '-50%' }, speed, function () { 
      $(this).hide();
      $bin.addClass('html-only');
      // makes me sad, but we have to put this in a try/catch because Safari
      // sometimes throws an error when using localStorage, then jQuery goes
      // in to an infinite loop if an animation callback throws an exeception!
      try {
        // we're not reading 'true', only that it's been set
        localStorage && localStorage.setItem('html-only', 'true');        
      } catch (e) {}
    });
  }
});

// $(window).bind('online', function () {
//   console.log("we're online");
// }).bind('offline', function () {
//   console.log("we're offline");
// });

