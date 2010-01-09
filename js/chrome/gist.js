var Gist = function (id) {
  this.code = '';
  var iframe = $('<iframe id="gistloader' + id + '" />').css('display', 'none').appendTo(document.body),
      win = iframe[0].contentDocument || iframe[0].contentWindow.document,
      gist = this;
  
  iframe.load(function () {
    var code = [];
    $('pre .line', win.body).each(function () { 
      code.push($(this).text());
    });
    gist.code = code.join("\n");
    
    var type = $('.gist-meta a:first', win.body).attr('href').substr(-2) == 'js' ? 'javascript' : 'html';
    
    editors[type].setCode(gist.code);
    iframe.remove();
  });
  win.open();
  win.write('<script src="http://gist.github.com/' + id + '.js"></script>');
  win.close();
};