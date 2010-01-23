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


$(window).unload(unload);

// hack for Opera because the unload event isn't firing to capture the settings, so we put it on a timer
if ($.browser.opera) {
  setInterval(unload, 500);
}

/* Boot code */
// if the user linked directly to #html, initially hide the JS panel
if (({ '#html':1, '#javascript':1 })[window.location.hash]) {
  document.getElementById('bin').className += ' ' + window.location.hash.substr(1) + '-only';
} else if (localStorage && localStorage.getItem('visible-panel')) {
  $bin.addClass(localStorage.getItem('visible-panel') + '-only');
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

$('div.label p').click(function () {
  // determine which side was clicked
  var panel = $(this).closest('.code').is('.javascript') ? 'javascript' : 'html',
      otherpanel = panel == 'javascript' ? 'html' : 'javascript';
      mustshow = $bin.is('.' + panel + '-only'),
      speed = 150,
      animatePanel = animateOtherPanel = {};
  
  if ($bin.is('.' + panel + '-only')) { // showing the panel
    // only the html tab could have been clicked
    animatePanel = panel == 'html' ? { left: '50%', width: '50%' } : { left: '0%', width: '50%' };
    animateOtherPanel = otherpanel == 'javascript' ? { left: '0%' } : { left: '50%' };
    $bin.find('div.' + panel).animate(animatePanel, speed);
    $bin.find('div.' + otherpanel).show().animate(animateOtherPanel, speed, function () {
      $bin.removeClass(panel + '-only');
      localStorage && localStorage.removeItem('visible-panel');
    });
  } else { // hiding other panel
    animatePanel = panel == 'html' ? { left: '0%', width: '100%' } : { width: '100%' };
    animateOtherPanel = otherpanel == 'javascript' ? { left: '-50%' } : { left: '100%' };
    
    $bin.find('div.' + panel).animate(animatePanel, speed);
    $bin.find('div.' + otherpanel).animate(animateOtherPanel, speed, function () { 
      $(this).hide();
      $bin.addClass(panel + '-only');
      // makes me sad, but we have to put this in a try/catch because Safari
      // sometimes throws an error when using localStorage, then jQuery goes
      // in to an infinite loop if an animation callback throws an exeception!
      try {
        // we're not reading 'true', only that it's been set
        localStorage && localStorage.setItem('visible-panel', panel);        
      } catch (e) {}
    });
  }
});

// $(window).bind('online', function () {
//   console.log("we're online");
// }).bind('offline', function () {
//   console.log("we're offline");
// });

