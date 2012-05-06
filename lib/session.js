module.exports = {
  loadUser: function (req, res, next) {
    req.models.user.load(req.param('name'), function (err, user) {
      if (err && err !== 'not-found') {
        return next(err);
      }
      if (!err) {
        req.user = user;
      }
      next();
    });
  },
  loginUser: function (req, res, next) {
    var model = req.models.user,
        user  = req.user,
        key   = req.param('key');

    function onValidate(err, same) {
      if (err) {
        return next(err);
      }
      if (!same) {
        return res.json(401, {ok: false});
      }

      // Add the user data to the session.
      req.session.user = {
        name: user.name,
        lastLogin: user.last_login
      };

      // Update the login timestamp but don't wait for a response as it's
      // non crucial.
      model.touchLogin(user.name, function () {});

      if (req.ajax) {
        res.json(200, {ok: true, key: '', created: false});
      } else {
        res.redirect(303, req.helpers.url(user.name));
      }
    }

    if (user) {
      if (user.created.getTime()) {
        model.valid(key, user.key, onValidate);
      } else {
        // No created timestamp so this is an old password. Validate it then
        // update it to use the new algorithm.
        if (model.validOldKey(key, user.key)) {
          model.updateKey(user.name, key, function (err) {
            onValidate(err, true);
          });
        } else {
          onValidate(null, false);
        }
      }
    } else {
      next();
    }
  },
  createUser: function (req, res, next) {
    var params = {
      name: req.param('name'),
      key: req.param('key'),
      email: req.param('email', '')
    };

    if (!params.name || !params.key) {
      return res.json(400, {ok: false, error: 'Missing username or password'});
    }

    req.models.user.create(params, function (err, id) {
      if (err) {
        return next(err);
      }

      // Add the user data to the session.
      req.session.user = {
        name: params.name,
        lastLogin: new Date()
      };

      if (req.ajax) {
        res.json(200, {ok: true, key: '', created: true});
      } else {
        res.redirect(303, req.helpers.url(params.name));
      }
    });
  }
};
