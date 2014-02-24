/*globals $:true*/
(function () {

  // don't bother with this functionality if there's no datalist support
  if (!('dataset' in document.createElement('i'))) {
    return;
  }

  var $control = $('#control'),
      $info = $('#menuinfo p'),
      useCmd = navigator.userAgent.indexOf(' Mac ') !== -1,
      re = /ctrl/g;

  $control.delegate('[data-desc]', 'mouseover mouseout', function (e) {
    if (e.type === 'mouseover') {
      var data = this.dataset;

      if (data.desc !== undefined) {
        var s = '';

        if (data.shortcut) {
          s += '<code>[';
          if (useCmd) {
            s += data.shortcut.replace(re, 'cmd');
          } else {
            s += data.shortcut;
          }
          s += ']</code>';
        }

        s += ' ' + data.desc;

        $info.html(s);
        $body.addClass('menuinfo');
      }
    } else {
      $body.removeClass('menuinfo');
    }
  });

})();