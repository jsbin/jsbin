'use strict';
/* globals $, backers */

var $backers = $('.backers');

backers.forEach(function (backer) {
  var $a = $('<a>');
  $a.attr('href', backer.url);
  var $img = $('<img>');
  $img.attr('src', backer.image).addClass('backer-img');
  $a.html($img);
  $backers.append($a);
});

var $backers = $('.backers');

backers.forEach(function (backer) {
  var $a = $('<a>');
  $a.attr('href', backer.url);
  var $img = $('<img>');
  $img.attr('src', backer.image).addClass('backer-img');
  $a.html($img);
  $backers.append($a);
});
