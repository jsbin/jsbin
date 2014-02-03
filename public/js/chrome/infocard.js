(function () {
  'use strict';
  /*global $:true, jsbin:true*/

  var $template = $($('#infocard').html()); // donkey way of cloning from template
  var $header = $template.find('header');
  var meta = jsbin.state.metadata || {};
  var classes = [];

  if (meta.name) {
    $header.find('.name b').html(meta.name);
    $header.find('img').attr('src', meta.avatar);
  }

  $header.find('time').html(prettyDate(meta.updated));

  if (meta.pro) {
    classes.push('pro');
  }

  if (meta.name === jsbin.user.name) {
    classes.push('owner');
  }

  $header.find('.visibility').text(meta.visibility);

  if (meta.visibility === 'private') {
    classes.push('private');
  } else if (meta.visibility === 'public') {
    classes.push('public');
  } // TODO handle team

  $template.addClass(classes.join(' ')).appendTo('body');
})();