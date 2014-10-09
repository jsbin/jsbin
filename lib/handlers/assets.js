'use strict';
var undefsafe = require('undefsafe');
var config = require('../config');
var features = require('../features');
var aws = require('aws-sdk');
var filesize = require('file-size');
var Promise = require('rsvp').Promise;
var noop = function (req, res, next) { return next(); };

var AWS_ACCESS_KEY = undefsafe(config, 'features.assets.key');
var AWS_SECRET_KEY = undefsafe(config, 'features.assets.secret');
var S3_BUCKET = undefsafe(config, 'features.assets.bucket');

aws.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_KEY
});

var s3 = new aws.S3();

// this is a compatibility layer for our handler index.js magic
var assets = module.exports = {
  name: 'assets'
};

assets.sign = function (req, res, next) {
  // strip slashes, not that they do anything, it's just a bit weird if they turn up
  var filename = req.query.s3_object_name.replace(/\//g, '');
  var objectName = req.session.user.name + '/' + filename;

  var s3_params = {
    Bucket: S3_BUCKET,
    Key: objectName,
    Expires: 60,
    ContentType: req.query.s3_object_type,
    ACL: 'public-read',
    CacheControl: 'public, max-age=' + (1000 * 60),
  };

  // throw away .exe files
  if (req.query.s3_object_type === 'application/x-msdownload') {
    // yeah...no thanks.
    return res.send(403);
  }

  s3.getSignedUrl('putObject', s3_params, function(error, data) {
    if (error) {
      console.log('s3.getSignedUrl.putObject fail for ' + req.session.user.name);
      console.log(error);
      res.statusCode = 500;
      return res.send(error.message);
    }

    var return_data = {
      signed_request: data,
      url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+objectName
    };
    res.write(JSON.stringify(return_data));
    res.end();
  });
};

assets.remove = function (req, res, next) {
  // assumes the user is logged in...
  var filename = req.body.key.replace(/\//g, '');
  var objectName = req.session.user.name + '/' + filename;

  var params = {
    Bucket: S3_BUCKET,
    Key: objectName,
  };

  s3.deleteObject(params, function(error, data) {
    if (error) {
      console.log(err, err.stack); // an error occurred
      res.send({ error: error });
    } else {
      console.log(data);
      res.send(true);
    }
  });
}

var _getFolderSize = function(bucket, folder, marker, callback) {
  var params = {
    Bucket : bucket,
    Prefix : folder + '/'
  };
  if (typeof marker === 'function') {
    callback = marker;
    marker = null;
  }
  if (marker !== null) {
    params.Marker = marker;
  }

  return new Promise(function (resolve, reject) {
    (s3.client || s3).listObjects(params, function (error, data) {
      if (error) {
        return reject(error);
      }

      var size = 0;
      var objects = [];
      if (data.hasOwnProperty('Contents')) {
        for (var i = 0; i < data.Contents.length; i++) {
          size += data.Contents[i].Size;
          if (data.Contents[i].Size) {
            // .replace(new RegExp('^' + folder + '/'), '')
            objects.push({ filename: data.Contents[i].Key, size: data.Contents[i].Size, human: readableFileSize(data.Contents[i].Size) });
          }
        }
      }

      if (!data.IsTruncated) {
        return resolve({ size: size, objects: objects });
      }

      marker = data.Contents[data.Contents.length - 1].Key;

      return _getFolderSize(bucket, folder, marker).then(function (data) {
        return { raw: size + data.size, objects: objects };
      });
    });
  });
};

function readableFileSize(size) {
  var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = 0;
  while(size >= 1024) {
      size /= 1024;
      ++i;
  }

  if ((size | 0) === size) {
    return size + ' ' + units[i];
  }

  return size.toFixed(1) + ' ' + units[i];
}


assets.size = function (req, res, next) {

  _getFolderSize(S3_BUCKET, req.session.user.name).then(function (data) {
    var size = data.size;
    res.send({ size: size, human: readableFileSize(size), objects: data.objects });
  }).catch(function (error) {
    console.log(error.stack);
    res.send({ error: error });
  });
};

if (!AWS_ACCESS_KEY || !AWS_SECRET_KEY || !S3_BUCKET) {
  if (config.environment === 'production') {
    console.warn('No asset config support');
  }

  Object.keys(assets).forEach(function (prop) {
    if (prop !== 'name') {
      assets[prop] = noop;
    }
  });
}