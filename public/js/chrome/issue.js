var githubIssue = (function () {
/*global $:true, jsbin:true */
  'use strict';

  function githubIssue() {
    var url = 'http://github.com/jsbin/jsbin/issues/new';
    var body = ['Please provide any additional information, record a screencast ',
               'with http://quickcast.io or http://screenr.com and attach a screenshot ',
               'if possible.\n\n**JS Bin info**\n\n* [%url%/edit](%url%/edit)\n* ',
               window.navigator.userAgent + '\n',
               (jsbin.user && jsbin.user.name ? '* ' + jsbin.user.name : ''),
               '\n'].join('');

    return url + '?body=' + encodeURIComponent(body.replace(/%url%/g, jsbin.getURL({ withRevision: true })));
  }

  var $newissue = $('#newissue');

  $('#help').parent().on('open', function () {
    $newissue.attr('href', githubIssue());
  });

  return githubIssue;
})();