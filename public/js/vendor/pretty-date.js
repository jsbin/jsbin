/*
 * JavaScript Pretty Date
 * Copyright (c) 2011 John Resig (ejohn.org)
 * Licensed under the MIT and GPL licenses.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time){
  'use strict';


  // Remy Sharp edit: July 13, 2014 specific to JS Bin
  // Need to replace Z in ISO8601 timestamp with +0000 so prettyDate() doesn't
  // completely remove it (and parse the date using the local timezone).
  var date = new Date((time || '').replace('Z', '+0000').replace(/-/g,'/').replace(/[TZ]/g,' ')),
    diff = (((new Date()).getTime() - date.getTime()) / 1000),
    dayDiff = Math.floor(diff / 86400);

  if ( isNaN(dayDiff) || dayDiff < 0 ) {
    return;
  }

  return dayDiff === 0 && (
      diff < 60 && 'just now' ||
      diff < 120 && '1 minute ago' ||
      diff < 3600 && Math.floor( diff / 60 ) + ' minutes ago' ||
      diff < 7200 && '1 hour ago' ||
      diff < 86400 && Math.floor( diff / 3600 ) + ' hours ago') ||
      shortDate(date.getTime());
}


function shortDate(time) {
  'use strict';
  var monthDict = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var date = new Date(time),
      mon = monthDict[date.getMonth()],
      day = date.getDate()+'',
      year = date.getFullYear(),
      thisyear = (new Date()).getFullYear();

  if (thisyear === year) {
    return day + ' ' + mon;
  } else {
    return day + ' ' + mon + ' ' + year;
  }
}

// If jQuery is included in the page, adds a jQuery plugin to handle it as well
if ( typeof window.$ !== 'undefined' ) {
  window.$.fn.prettyDate = function(){
    'use strict';
    /* global $*/
    return this.each(function(){
      var date = prettyDate(this.getAttribute('pubdate'));
      if ( date ) {
        $(this).text( date );
      }
    });
  };
}