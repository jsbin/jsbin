//= require "../render/lightbox"

$('#startingpoint').click(function () {
  if (localStorage) {
    localStorage.setItem('saved-javascript', editors.javascript.getCode());
    localStorage.setItem('saved-html', editors.html.getCode());
  }
  return false;
});

$('#revert').click(function () {
  sessionStorage.removeItem('javascript');
  sessionStorage.removeItem('html');

  populateEditor('javascript');
  populateEditor('html');

  editors.javascript.focus();
  $('#library').val('none');
  
  if (window.gist != undefined) {
    editors[gist.type].setCode(gist.code);
  }

  $(document).trigger('codeChange', [ true ]);

  return false;
});

$('#control .button').click(function (event) {
  event.preventDefault();
  $('body').removeAttr('class').addClass(this.hash.substr(1));

  if ($(this).is('.preview')) {
    renderPreview();
  } 
});

$('#control div.help a').click(function (event) {
  event.preventDefault();
  var useAjax = false,
      url = $(this).attr('href'); // using href to ensure the url doesn't resolve
      
  if (url.substr(0, 1) == '#') {
    url = this.hash; // id based
  } else {
    useAjax = true;
  }
  
  if (useAjax) {
    $.ajax({
      url: url,
      dataType: 'html',
      error: function () {
        // console.log(arguments);
      },
      complete: function (res) {
        var content = $('<div />').append(res.responseText.replace(/<script(.|\s)*?\/script>/g, "")).find('#content').html();
        var lightbox = new Lightbox(content, 100).show();
      }
    });
  }
});









