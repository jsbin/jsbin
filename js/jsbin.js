//= require <jquery>

// required because jQuery 1.4.4 lost ability to search my object property :( (i.e. a[host=foo.com])
jQuery.expr[':'].host = function(obj, index, meta, stack) {
  return obj.host == meta[3];
};

(function (window, document, undefined) {
//= require "editors/editors"
//= require "render/render"
//= require "chrome/beta"
//= require "chrome/app"
})(this, document);
