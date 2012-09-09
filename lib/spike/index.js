var parse   = require('url').parse,
    querystring = require('querystring').parse,
    sessions = {},
    sessionsFromUser = {},
    pending = {};

setInterval(function () {
  pending = {};
}, 15 * 60 * 1000);

function removeConnection(id, res) {
  if (sessions[id]) {
    var responses = sessions[id].res,
        index = responses.indexOf(res);

    if (index !== -1) {
      responses.splice(index, 1);

      // Remove the object if we're not using it.
      if (!responses.length) {
        delete sessions[id];
      }
    }    
  }
}

function keyForBin(bin) {
  return bin.url + '/' + bin.revision;
}

function sessionForBin(bin, create) {
  var key = keyForBin(bin),
      session = sessions[key];

  if (!session && create === true) {
    session = sessions[key] = { res: [], log: [] };
  }

  return session || null;
}

module.exports = {
  getLog: function (req, res) {
    // TODO: Work out what the hell to do with this.
    var session = sessionForBin(req.bin), log;
    res.writeHead(200, {'Content-Type': 'text/html', 'Cache-Control': 'no-cache'});
    log = session ? session.log.join('\n<li>') : 'No session';
    res.end('<!DOCTYPE html><html><title>\n' + req.bin.url + '</title><body><ul><li>' + log);
  },

  postLog: function (req, res, next) {
    var session = sessionForBin(req.bin, true);

    // passed over to Server Sent Events on jsconsole.com
    if (session) {
      session.log.push('message: ' + req.body.data);
      res.send(200);
    } else {
      next();
    }
  },

  // listening stream
  getStream: function (req, res, next) {
    // Check request's accepts header for supported content types. If event
    // stream has precedence then return it otherwise pass on to next handler.
    if (req.headers.accept && req.headers.accept.indexOf('text/event-stream') !== -1) {
      var session = sessionForBin(req.bin, true),
          keepalive = null,
          close, closeTimer;

      console.log('STREAM ACCEPTED', req.headers['user-agent']);
      res.writeHead(200, {'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache'});
      res.write('id: 0\n\n');

      session.res.push(res);

      if (req.keepLatest) {
        if (!sessionsFromUser[req.user.name]) {
          sessionsFromUser[req.user.name] = [];
        }
        sessionsFromUser[req.user.name].push({ key: keyForBin(req.bin), res: res });
      }

      keepalive = setInterval(function () {
        res.write('id: 0\n\n');
      }, 15 * 1000);

      // FIXME this will break when using /rem/last/ as req.bin won't be the same bin anymore.
      close = function () {
        clearInterval(keepalive);
        clearTimeout(closeTimer);
        removeConnection(keyForBin(req.bin), res);
      };

      // every 5 minutes, let's let them reconnect
      closeTimer = setTimeout(function () {
        res.end();
        req.emit('close');
      }, 15 * 60 * 1000);

      res.socket.on('close', close);
      req.on('close', close);
      res.req = req;
    } else {
      next();
    }
  },

  reload: function (bin) {
    var session = sessionForBin(bin);

    if (session) {
      session.res.forEach(function (res) {
        res.write('event: reload\ndata: 0\n\n');

        if (res.ajax) {
          res.end(); // lets older browsers finish their xhr request
          res.req.emit('close');
        }
      });
    }
  },

  updateUserSpikes: function (user, bin) {
    var key = keyForBin(bin);
    if (sessionsFromUser[user]) {
      sessionsFromUser[user].forEach(function (oldbin) {
        var oldbinKey = oldbin.key,
            session;

        if (oldbinKey !== key) {
          oldbin.res.req.bin = bin; // this allows the clean up function to remove the *right* bin
          // change the session link
          removeConnection(oldbinKey, oldbin.res);

          session = sessionForBin(bin, true);
          session.res.push(oldbin.res);
          oldbin.key = key;
        }
      });
    }
  },

  ping: function (bin, data) {
    var id = bin.id,
        delayTrigger = 500;

    if (!pending[id]) {
      pending[id] = {};
    }

    pending[id].bin = bin;
    pending[id][data.panelId] = data;

    clearTimeout(pending[id].timer);

    // NOTE: this will only fire once per jsbin session -
    // not for every panel sent - because we clear the timer
    pending[id].timer = setTimeout(function () {
      var session = sessionForBin(bin),
          data = null;

      if (session) {
        // were we try to get clever.
        if (pending[id].javascript) {
          // this will cause a reload on the client
          data = pending[id].javascript;
        } else if (pending[id].html) {
          // this will cause a reload on the client (but in future will be conditional)
          data = pending[id].html;

          // so at some point, we'll also want to send the CSS as a second message
        } else if (pending[id].css) {
          // this will cause a CSS reload only
          data = pending[id].css;
        }

        if (data) {
          session.res.forEach(function (res) {
            res.write('data:' + data.content.split('\n').join('\ndata:') + '\nevent:' + data.panelId + '\n\n');
            res.write('event: stats\ndata: ' + JSON.stringify({ connections: session.res.length }) + '\n\n');
            if (res.ajax) {
              res.end(); // lets older browsers finish their xhr request
              res.req.emit('close');
            }
          });
        }
      }

      delete pending[id];
    }, delayTrigger);
  },
  appendScripts: function (scripts) {
    // TODO this should really detect that there's an active session going
    // on and the user is saving, and therefore include the spike intelligently
    scripts.push('js/vendor/eventsource.js');
    scripts.push('js/spike.js');
  }
};
