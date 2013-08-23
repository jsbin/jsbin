(function () {

  var $newissue = $('#newissue'),
      url = 'http://github.com/remy/jsbin/issues/new',
      body = 'Please provide any additional information, record a screencast '
             + 'with http://quickcast.io or http://screenr.com and attach a screenshot '
             + 'if possible.\n\n**JS Bin info**\n\n* [%url%](%url%)\n* '
             + window.navigator.userAgent + '\n'
             + (jsbin.user && jsbin.user.name ? '* ' + jsbin.user.name : '')
             + '\n';

  $('#help').parent().on('open', function () {
    console.log('open');
    $newissue.attr('href', url + '?body=' + encodeURIComponent(body.replace(/%url%/g, jsbin.getURL())));
  });

})();