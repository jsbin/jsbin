var Gist = function (id) {
  this.code = '';
  var iframe = $('<iframe id="gistloader' + id + '" />').css('display', 'none').appendTo(document.body),
      win = iframe[0].contentDocument || iframe[0].contentWindow.document,
      gist = this;

  this.code = {};

  analytics.loadGist(id);

  iframe.load(function () {
    $('.gist-file', win.body).each(function () {
      var code = [];
      $('pre .line', this).each(function () {
        code.push($(this).text());
      });

      var metaHref = $('.gist-meta a:first', this).attr('href');
      var type = 'html'
      if (metaHref.substr(-2) == 'js') type = 'javascript';
      if (metaHref.substr(-3) == 'css') type = 'css';

      gist.code[type] = code.join("\n");
    });
    gist.setCode();
    iframe.remove();
  });
  win.open();
  win.write('<script src="http://gist.github.com/' + id + '.js"></script>');
  win.close();
};

Gist.prototype.setCode = function () {
  for (var type in this.code) {
    editors[type].setCode(gist.code[type]);
  }
};

/**
 * Export as gist
 */

$(function () {

  $('body').on('click', '#export-as-gist', function (e) {
    e.preventDefault();
    var gist = {
      'public': true,
      files: {}
    };
    $.each([
      { panel: 'html' },
      { panel: 'css' },
      { panel: 'javascript', extension: 'js' }
    ], function (index, data) {
      var ext = data.extension || data.panel;
      gist.files['jsbin.' + ext] = {
        content: jsbin.panels.panels[data.panel].getCode()
      };
    });

    var token = '';
    if (jsbin.user && jsbin.user.github_token) {
      token = '?access_token=' + jsbin.user.github_token;
    }

    $.ajax({
      type: "POST",
      url: 'https://api.github.com/gists' + token,
      data: JSON.stringify(gist),
      dataType: 'json',
      crossDomain: true,
      success: function (data) {
        $document.trigger('info', 'Gist created! <a href="'+data.html_url+'" target="_blank">Open in new tab.</a>');
      }
    });
  });
});