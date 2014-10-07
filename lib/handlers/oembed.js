'use strict';

var oembed = module.exports = {
  name: 'oembed'
};

// oEmbed endpoint with JSONP support.
oembed.embed = function(req, res, next) {
  var url = req.query.url;

  if (!url || !url.match(req.app.settings['url host'])) {
    return next(400);
  }

  var embedUrl = url.replace(/\/edit\b/, '/embed');
  var callback = req.query.callback;
  var width = req.query.maxwidth  || 640;
  var height = req.query.maxheight || 480;

  var oembed = {
    type: 'rich',
    version: '1.0',
    title: 'JS Bin',
    url: url,
    width: width,
    height: height,
    html: '<iframe src="' + embedUrl + '" width="' + width + '" height="' + height + '" frameborder="0"></iframe>',
  };

  // use express' jsonp method for the "safe" jsonp call
  if (callback) {
    res.jsonp(oembed);
  } else {
    res.json(oembed);
  }
};
