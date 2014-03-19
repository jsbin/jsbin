/*global jQuery:true*/
(function (jQuery) {
  'use strict';

  var matched, browser = {};

  jQuery.uaMatch = function( ua ) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
      /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
      /(msie) ([\w.]+)/.exec( ua ) ||
      ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
      [];

    return {
      browser: match[ 1 ] || '',
      version: match[ 2 ] || '0'
    };
  };

  // Don't clobber any existing jQuery.browser in case it's different
  if ( !jQuery.browser ) {
    matched = jQuery.uaMatch( navigator.userAgent );

    if ( matched.browser ) {
      browser[ matched.browser ] = true;
      browser.version = matched.version;
    }

    // Chrome is Webkit, but Webkit is also Safari.
    if ( browser.chrome ) {
      browser.webkit = true;
    } else if ( browser.webkit ) {
      browser.safari = true;
    }

    jQuery.browser = browser;
  }
})(jQuery);