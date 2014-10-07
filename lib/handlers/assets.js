'use strict';
var undefsafe = require('undefsafe');
var config = require('../config');
var features = require('../features');
var aws = require('aws-sdk');
var S3Sizer = require('aws-s3-size');
var filesize = require('file-size');
var noop = function (req, res, next) { return next(); };

var AWS_ACCESS_KEY = undefsafe(config, 'features.assets.key');
var AWS_SECRET_KEY = undefsafe(config, 'features.assets.secret');
var S3_BUCKET = undefsafe(config, 'features.assets.bucket');

aws.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY
});

var s3 = new aws.S3();

var s3sizer = new S3Sizer({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY,
});

// this is a compatibility layer for our handler index.js magic
var assets = module.exports = {
  name: 'assets'
};

assets.sign = function (req, res, next) {
  // TODO sanitise s3_object_name
  var filename = req.query.s3_object_name;
  var objectName = req.session.user.name + '/' + req.query.s3_object_name;

  var s3_params = {
    Bucket: S3_BUCKET,
    Key: objectName,
    Expires: 60,
    ContentType: req.query.s3_object_type,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3_params, function(error, data) {
    if (error) {
      console.log('s3.getSignedUrl.putObject fail for ' + req.session.user.name);
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

assets.size = function (req, res, next) {
  s3sizer.getFolderSize(S3_BUCKET, req.session.user.name, function(err, size) {
    res.send({ size: size, human: filesize(size).human() });
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