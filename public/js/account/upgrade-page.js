'use strict';
/* globals $, features */

var $table = $('table');

features.sort(function (a, b) {
  return a.user - b.user;
});

features.forEach(function (feature) {
  var $row = $('<tr>');
  $row.append(
    $('<td>').html(feature.name).addClass('feature')
  );

  for (var i = 0; i < 3; i++) {
    var $td = $('<td>');
    // use this if we reverse order of columns
    if (i > feature.user - 1) {
    //if ((2 - i) >= feature.user) {
      $td.html('&#10004;').addClass();
    } else {
      $td.html(' ').addClass();
    }
    $row.append($td);
  }

  $table.append($row);
});
