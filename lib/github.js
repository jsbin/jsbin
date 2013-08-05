var passport       = require('passport'),
    GitHubStrategy = require('passport-github').Strategy;

module.exports = function (options) {
  /**
   * Passport configuration
   */

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new GitHubStrategy({
      clientID: options.github.id,
      clientSecret: options.github.secret
    },
    function(accessToken, refreshToken, profile, done) {
      // Delete information we don't need that will fill up the cookie jar
      //
      //      .---------------------------.
      //      /_   _   _         __  __   /|
      //     // \ / \ / \ |_/ | |_  (_   / |
      //    / \_  \_/ \_/ | \ | |__ ,_/ /  |
      //   :.__________________________/   /
      //   |  .--. .--.   .--.   .--.  |  /
      //   | (    )    ) (    ) (    ) | /
      //   |  '--' '--'   '--'   '--'  |/
      //   '---------------------------'
      //
      profile.email = profile._json.email;
      delete profile._raw;
      delete profile._json;
      delete profile.photos;
      return done(null, {
        access_token: accessToken,
        profile: profile
      });
    }
  ));

  if (options.github && options.github.id) {
    return {
      initialize: function (app) {
        app.use(passport.initialize());
      }
    };
  } else {
    return {
      initialize: function () {
        console.log('doing nothing');
      }
    };
  }
};