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

  $('#export-as-gist').click(function (e) {
    var gist = {
      'public': true,
      files: {}
    },
    panels = [
      { panel: 'html' },
      { panel: 'css' },
      { panel: 'javascript', extension: 'js' }
    ];

    // Add files to gist for each panel
    panels.forEach(function (data, index) {
      var code;
      try {
        code = jsbin.panels.panels[data.panel].getCode();
      } catch(e) {}
      if (!code || !code.length) return;
      // Figure out what the file extension should be according to the processor
      var ext = data.extension || data.panel,
          processor = jsbin.panels.panels[data.panel].processor;
      if (processor && processor.extensions) {
        ext = processor.extensions[0] || processor.name;
      }
      // Build a file name
      var file = ['jsbin', jsbin.state.code, ext].join('.');
      gist.files[file] = {
        content: code
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
    // return false becuase there's weird even stuff going on. ask @rem.
    return false;
  });
});