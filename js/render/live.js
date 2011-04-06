var $live = $('#live'),
    $body = $('body'),
    throttledPreview = throttle(renderLivePreview, 100);

//= require "consoleContext"
var hijackedConsole = new ConsoleContext(function () {
  return $('#live iframe').length ? $('#live iframe')[0].contentWindow : null;
});

$body.delegate('#control .button.live', 'click', function () {
  $live.trigger('toggle');
});

// could chain - but it's more readable like this
$live.bind('show', function () {
  $body.addClass('live');
  localStorage && localStorage.setItem('livepreview', true);
  
  // start timer
  $(document).bind('codeChange.live', throttledPreview);
  renderLivePreview();
  hijackedConsole.activate();
}).bind('hide', function () {
  $(document).unbind('codeChange.live');
  localStorage && localStorage.removeItem('livepreview');
  $body.removeClass('live');
  hijackedConsole.deactivate();
}).bind('toggle', function () {
  $live.trigger($body.is('.live') ? 'hide' : 'show');
});

function enableLive() {
  $('#control .buttons .preview').after('<a id="showlive" class="button live group right left light gap" href="#">Live</a>');
}

function two(s) {
  return (s+'').length < 2 ? '0' + s : s;
}

function renderLivePreview() {
  var oldframe = $live.find('iframe').remove();
  var frame = $live.append('<iframe class="stretch"></iframe>').find('iframe')[0],
      document = frame.contentDocument || frame.contentWindow.document,
      source = getPreparedCode(),
      window = document.defaultView || document.parentWindow,
      d = new Date();
      
  // nullify the blocking functions
  window.alert = function () {};
  window.prompt = function () {};
  window.confirm = function () {};
  
  if (!useCustomConsole) console.log('--- refreshing live preview @ ' + [two(d.getHours()),two(d.getMinutes()),two(d.getSeconds())].join(':') + ' ---');
  
  document.open();

  if (debug) {
    document.write('<pre>' + source.replace(/[<>&]/g, function (m) {
      if (m == '<') return '&lt;';
      if (m == '>') return '&gt;';
      if (m == '"') return '&quot;';
    }) + '</pre>');
  } else {
    document.write(source);
  }
  document.close();
}

$live.find('.close').click(function () {
  $live.trigger('hide');
});