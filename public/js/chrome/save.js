// to allow for download button to be introduced via beta feature
$('a.save').click(function (event) {
  event.preventDefault();

  // save our panel layout - assumes our user is happy with this layout
  jsbin.panels.save();
  saveCode('save', window.location.pathname.indexOf('/edit') !== -1);

  return false;
});

$('a.clone').click(function (event) {
  event.preventDefault();

  // save our panel layout - assumes our user is happy with this layout
  jsbin.panels.save();

  var $form = setupform('save,new');
  $form.submit();

  return false;
});

function setupform(method) {
var $form = $('form#saveform')
    .append('<input type="hidden" name="javascript" />')
    .append('<input type="hidden" name="html" />')
    .append('<input type="hidden" name="css" />');

  $form.find('input[name=javascript]').val(editors.javascript.getCode());
  $form.find('input[name=css]').val(editors.css.getCode());
  $form.find('input[name=html]').val(editors.html.getCode());
  $form.find('input[name=method]').val(method);
  return $form;
}

function pad(n){
  return n<10 ? '0'+n : n
}

function ISODateString(d){
  return d.getFullYear()+'-'
    + pad(d.getMonth()+1)+'-'
    + pad(d.getDate())+'T'
    + pad(d.getHours())+':'
    + pad(d.getMinutes())+':'
    + pad(d.getSeconds())+'Z'
}

function saveCode(method, ajax, ajaxCallback) {
  // create form and post to it
  var $form = setupform(method);
  // save our panel layout - assumes our user is happy with this layout
  jsbin.panels.save();
  jsbin.panels.saveOnExit = true;

  if (ajax) {
    $.ajax({
      url: $form.attr('action'),
      data: $form.serialize(),
      dataType: 'json', 
      type: 'post',
      success: function (data) {
        $('form').attr('action', data.url + '/save');
        ajaxCallback && ajaxCallback();

        if (window.history && window.history.pushState) {
          var $binGroup = $('#history tr[data-url="' + window.location.pathname.replace(/edit.*$/, '') + '"]'),
              edit = data.edit.replace(location.protocol + '//' + window.location.hostname, '') + window.location.search;
          $binGroup.find('td.url a span.first').removeClass('first');
          $binGroup.before('<tr data-url="' + data.url + '/" data-edit-url="' + edit + '"><td class="url"><a href="' + edit + '?live"><span class="first">' + data.code + '/</span>' + data.revision + '/</a></td><td class="created"><a href="' + edit + '" pubdate="' + data.created + '">Just now</a></td><td class="title"><a href="' + edit + '">' + data.title + '</a></td></tr>');

          window.history.pushState(null, edit, edit);

          $('#jsbinurl').attr('href', data.url).text(data.url.replace(/http:\/\//, ''));
          updateTitle(true)
        } else {
          window.location = data.edit;
        }
      },
      error: function () {

      }
    });
  } else {
    $form.submit();
  }
}