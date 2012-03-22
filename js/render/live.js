var $live = $('#live'),
    $body = $('body'),
    showlive = $('#showlive')[0],
    throttledPreview = throttle(renderLivePreview, 200);

///= require "consoleContext"
// var hijackedConsole = new ConsoleContext(function () {
//   return $('#live iframe').length ? $('#live iframe')[0].contentWindow : null;
// });

// could chain - but it's more readable like this
$live.bind('show', function () {
  // hijackedConsole.activate();
  $body.addClass('live');
  showlive.checked = true;
  localStorage && localStorage.setItem('livepreview', true);
  
  var data = $live.data();
  if (data.splitter) {
    data.splitter.show().trigger('init');
  }
  // start timer
  $(document).bind('codeChange.live', throttledPreview);
  renderLivePreview();
}).bind('hide', function () {
  // hijackedConsole.deactivate();
  $(document).unbind('codeChange.live');
  localStorage && localStorage.removeItem('livepreview');
  $body.removeClass('live');
  showlive.checked = false;

  $('#source').css('right', 0);

  var data = $live.data();
  if (data.splitter) {
    data.splitter.hide();
  }
}).bind('toggle', function () {
  $live.trigger($body.is('.live') ? 'hide' : 'show');
});

function enableLive() {
  // $('#control .buttons .preview').after('<a id="showlive" class="button live group right left light gap" href="#">Live</a>');
}

function two(s) {
  return (s+'').length < 2 ? '0' + s : s;
}

function renderLivePreview() {
  var source = getPreparedCode(),
      oldframe = $live.find('iframe').remove(),
      frame = $live.append('<iframe class="stretch" frameBorder="0"></iframe>').find('iframe')[0],
      document = frame.contentDocument || frame.contentWindow.document,
      window = document.defaultView || document.parentWindow,
      d = new Date();
 
  if (!useCustomConsole) console.log('--- refreshing live preview @ ' + [two(d.getHours()),two(d.getMinutes()),two(d.getSeconds())].join(':') + ' ---');

  // strip autofocus from the markup - prevents the focus switching out of the editable area
  source = source.replace(/(<.*?\s)(autofocus)/g, '$1');

  var run = function () {
    document.open();

    if (debug) {
      document.write('<pre>' + source.replace(/[<>&]/g, function (m) {
        if (m == '<') return '&lt;';
        if (m == '>') return '&gt;';
        if (m == '"') return '&quot;';
      }) + '</pre>');
    } else {
      // nullify the blocking functions
      // IE requires that this is done in the script, rather than off the window object outside of the doc.write
      document.write('<script>window.print=function(){};window.alert=function(){};window.prompt=function(){};window.confirm=function(){};</script>');
      document.write(source);
    }
    document.close();
  }

  // WebKit requires a wait time before actually writing to the iframe
  // annoyingly it's not consistent (I suspect WebKit is the buggy one)
  if (iframedelay.active) {
    // this setTimeout allows the iframe to be rendered before our code
    // runs - thus allowing us access to the innerWidth, et al
    setTimeout(run, 10);
  } else {
    run();
  }
}

$live.find('.close').click(function () {
  updatePanel('live', false);
});
