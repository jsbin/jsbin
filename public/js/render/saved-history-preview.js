// inside a ready call because history DOM is rendered *after* our JS to improve load times.
$(function ()  {

//= require "../vendor/pretty-date"

if ($('#history').length) (function () {
  function render(url) {
    if (url.lastIndexOf('/') !== url.length - 1) {
      url += '/';
    }
    iframe.src = url + 'quiet';
    iframe.removeAttribute('hidden');
    viewing.innerHTML = url;
  }

  function matchNode(el, nodeName) {
    if (el.nodeName == nodeName) {
      return el;
    } else if (el.nodeName == 'BODY') {
      return false;
    } else {
      return matchNode(el.parentNode, nodeName);
    }
  }

  function visit() {
    window.location = this.getAttribute('data-edit-url');
  }

  var preview = $('#history .preview'),
      iframe = $('#history iframe')[0],
      bins = $('#history'),
      trs = $('#history tr'),
      current = null,
      viewing = $('#history #viewing')[0],
      hoverTimer = null;

  // stop iframe load removing focus from our main window
  bins.delegate('tr', 'click', visit);
  // this is some nasty code - just because I couldn't be
  // bothered to bring jQuery to the party.
  bins.mouseover(function (event) {
    clearTimeout(hoverTimer);
    var url, target = event.target;
    if (target = matchNode(event.target, 'TR')) {
      if (target.getAttribute('data-type') !== 'spacer') {
        // target.className = 'hover';
        // target.onclick = visit;
        url = target.getAttribute('data-url');
        if (current !== url) {
          hoverTimer = setTimeout(function () {
            bins.find('tr').removeClass('selected').filter(target).addClass('selected');
            current = url;
            render(url);
          }, 200);
        }
      }
    }
  });

  // Need to replace Z in ISO8601 timestamp with +0000 so prettyDate() doesn't
  // completely remove it (and parse the date using the local timezone).
  $('#history a').attr('pubdate', $('#history a').attr('pubdate').replace('Z', '+0000'));
  $('#history a').prettyDate();
  setInterval(function(){ $('#history td.created a').prettyDate(); }, 30 * 1000);

})();

});
