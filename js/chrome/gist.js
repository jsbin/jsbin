var Gist = function (id) {
  this.code = '';
  var iframe = $('<iframe id="gistloader' + id + '" />').css('display', 'none').appendTo(document.body),
      win = iframe[0].contentDocument || iframe[0].contentWindow.document,
      gist = this;

  this.code = {};
  
  iframe.load(function () {
    $('.gist-file', win.body).each(function () {
      var code = [];
      $('pre .line', this).each(function () { 
        code.push($(this).text());
      });

      var type = $('.gist-meta a:first', this).attr('href').substr(-2) == 'js' ? 'javascript' : 'html';

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