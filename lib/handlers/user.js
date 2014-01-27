'use strict';
var utils = require('../utils'),
    Observable = utils.Observable,
    UserModel;

module.exports = Observable.extend({
  constructor: function UserHandler(sandbox) {
    Observable.apply(this, arguments);

    this.models = sandbox.models;
    UserModel = sandbox.models.user;
    this.mailer = sandbox.mailer;
    this.helpers = sandbox.helpers;

  },
  validate: function (req, res, next) {
    console.log('woooo');
    var username  = req.param('username');
    var key       = req.param('key');


    UserModel.load(username, function (err, user) {

      var validationComplete = function(err, validated){
        console.log('valid::', validated);
        if (validated) {
          req.validatedUser = user;
        }
        next(err);
      };

      if (err || !user) {
        next(err);
      }

      var JSBin2User = !user.created.getTime();
      var validateKey = UserModel['valid' + (JSBin2User ? 'OldKey' : '')]; 

      console.log('JSBin2User::', JSBin2User);

      if (!JSBin2User) {
        validateKey(key, user.key, validationComplete);
      } else { 
      
        validateKey(key, user.key, function(err, valid) {

          validationComplete = validationComplete.bind(null, err , valid);

          if (err || !valid) {
            return validationComplete();
          } 
          
          UserModel.upgradeKey(user.name, key, validationComplete);

        });

      }

    });
        
  }

});
