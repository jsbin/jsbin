'use strict';

var config = require('../config');

var oembed = module.exports = {
  name: 'oembed'
};

// oEmbed endpoint with JSONP support.
oembed.embed = function(req, res) {
  var url = req.query.url;

  if (!url || !url.match(config.url.host)) { return res.send(400); }

  var embedUrl  = url.replace(/\/edit\?/, '/embed?');
  var callback  = req.query.callback;
  var width     = req.query.maxwidth  || 640;
  var height    = req.query.maxheight || 480;

  var oembed = {
    type:   'rich',
    version: '1.0',
    title:  'JS Bin',
    url:    url,
    width:  width,
    height: height,
    html:   '<iframe src="' + embedUrl + '" width="' + width + '" height="' + height + '" frameborder="0"></iframe>',
  };

  var output = callback ? callback + '(' + JSON.stringify(oembed) + ')' : oembed;

  res.set('Content-Type', 'application/javascript');
  res.send(output);
};
