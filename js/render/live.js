var $live = $('#live'),
    $bin = $('#bin'),
    throttledPreview = throttle(renderLivePreview, 250);

// could chain - but it's more readable like this
$live.bind('show', function () {
  $bin.addClass('live');
  localStorage && localStorage.setItem('livepreview', true);
  
  
  // start timer
  $(document).bind('codeChange.live', throttledPreview);
  renderLivePreview();
}).bind('hide', function () {
  $(document).unbind('codeChange.live');
  localStorage && localStorage.removeItem('livepreview');
  $bin.removeClass('live');
}).bind('toggle', function () {
  $live.trigger($bin.is('.live') ? 'hide' : 'show');
});

function two(s) {
  return (s+'').length < 2 ? '0' + s : s;
}

function renderLivePreview() {
  $live.find('iframe').remove();
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