'use strict';
var undefsafe = require('undefsafe');
var config = require('../config');
var features = require('../features');
var aws = require('aws-sdk');
var noop = function (req, res, next) { return next(); };

// this is a compatibility layer for our handler index.js magic
var assets = module.exports = {
  name: 'assets'
};

var AWS_ACCESS_KEY = undefsafe(config, 'features.assets.key');
var AWS_SECRET_KEY = undefsafe(config, 'features.assets.secret');
var S3_BUCKET = undefsafe(config, 'features.assets.bucket');

assets.sign = function (req, res, next) {
  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  });

  var s3 = new aws.S3();

  // TODO sanitise s3_object_name
  var objectName = req.session.user.name + '/' + req.query.s3_object_name;

  var s3_params = {
    Bucket: S3_BUCKET,
    Key: objectName,
    Expires: 60,
    ContentType: req.query.s3_object_type,
    ACL: 'public-read'
  };
  console.log(s3_params);
  s3.getSignedUrl('putObject', s3_params, function(error, data) {
    if (error) {
      return console.log(error);
    }

    var return_data = {
      signed_request: data,
      url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+objectName
    };
    res.write(JSON.stringify(return_data));
    res.end();
  });
};

if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY || !S3_BUCKET) {
  if (config.config.environment === 'production') {
    console.warn('No asset config support');
  }

  Object.keys(assets).forEach(function (prop) {
    if (prop !== 'name') {
      assets[prop] = noop;
    }
  });
}