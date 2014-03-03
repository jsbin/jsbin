'use strict';
var processors = require('../processors'),
    _ = require('underscore'),
    replify = require('replify'),
    undefsafe = require('undefsafe'),
    binModel = require('../models').createModels().bin;

var utils = {},
    sessions = {},
    sessionsFromUser = {},
    pending = {},
    pendingToKillStreaming = {};

var metrics = require('../metrics'),
    openSpikes = 0;

setInterval(function () {
  pending = {};
}, 15 * 60 * 1000);

replify('spike', {
  utils: utils,
  sessions: sessions,
  sessionsFromUser: sessionsFromUser,
  pending: function () {
    return pending;
  },
  openSpikes: function () {
    return openSpikes;
  }
});

// keep checking the sessions we have, and if any of the response objects
// are no longer writable, then we removed them from our list
setInterval(function () {
  Object.keys(sessions).forEach(function (id) {
    sessions[id].res.forEach(function (res) {
      if (!res.connection.writable) {
        utils.removeConnection(id, res);
      }
    });
  });
}, 1000 * 60);


/**
 * Remove a response object from the list associated with the id passed.
 */
utils.removeConnection = function (id, res) {
  if (!sessions[id]) { return; }
  var responses = sessions[id].res,
      index = responses.indexOf(res);

  if (index === -1) { return; }

  responses.splice(index, 1);

  // Update the metrics
  openSpikes -= 1;
  if (openSpikes < 0) {
    openSpikes = 0;
  }
  metrics.gauge('spike.open', openSpikes);

  // Remove any user spikes following
  Object.keys(sessionsFromUser).forEach(function (username) {
    sessionsFromUser[username] = sessionsFromUser[username].filter(function (session) {
      return session.key !== id;
    });
  });

  // ping stats
  spike.ping(res.req.bin, {}, true);

  // Remove the object if we're not using it.
  if (!responses.length) {
    delete sessions[id];
  }
};

utils.keyForBin = function (bin) {
  return bin.url + '/' + bin.revision;
};

utils.sessionForBin = function (bin, create) {
  var key = utils.keyForBin(bin),
      session = sessions[key];

  if (!session && create === true) {
    session = sessions[key] = { res: [], log: [] };
  }

  return session || null;
};

function isOwnerWithWrite(session, bin, checksum) {
  var user = undefsafe(session, 'user.name'),
      owner = undefsafe(bin, 'metadata.name'),
      streamingKey = undefsafe(bin, 'streaming_key');

  return (user === owner && streamingKey === checksum);
}

/**
 * Turn some data (a string or object) into an event-source data & event string.
 */
utils.makeEvent = function (eventName, data) {
  if (!eventName) { return ''; }
  var str = '';
  if (typeof data !== 'string') {
    data = JSON.stringify(data);
  }
  if (data) {
    str += 'data: ' + (''+data).split('\n').join('\ndata: ');
  }
  return 'event: ' + eventName + '\n' + str + '\n\n';
};

/**
 * Process a spike data object with the relevant preprocessor. Takes an object
 * and a bin's settings object.
 *
 * Returns an object with the same keys but with processed data.
 */
utils.process = function(data, settings) {
  data = data || {};
  settings = settings || {};
  // Grab the processor settings
  var processorSettings = settings.processors;
  if (!processorSettings) {
    return data;
  }
  // Get the name of the currently used processor
  var processorName = processorSettings[data.panelId];
  if (!processorName) {
    return data;
  }
  // Find this processor in the list of processors
  if (!processors[processorName]) {
    return newData;
  }
  // And process!
  var newData = _.clone(data);
  newData.raw = data.content;
  newData.content = processors[processorName](data.content);
  return newData;
};

var spike = module.exports = {
  getLog: function (req, res) {
    // TODO: Work out what the hell to do with this.
    var session = utils.sessionForBin(req.bin), log;
    res.writeHead(200, {'Content-Type': 'text/html', 'Cache-Control': 'no-cache'});
    log = session ? session.log.join('\n<li>') : 'No session';
    res.end('<!DOCTYPE html><html><title>\n' + req.bin.url + '</title><body><ul><li>' + log);
  },

  postLog: function (req, res, next) {
    var session = utils.sessionForBin(req.bin, true);

    // passed over to Server Sent Events on jsconsole.com
    if (session) {
      session.log.push('message: ' + req.body.data);
      res.send(200);
    } else {
      next();
    }
  },

  /**
   * Setup an event stream for the client. This is hit on all bin endpoints.
   */
  getStream: function (req, res, next) {

    // Check request's accepts header for event-stream. Move on if it doesn't
    // support it.
    if (!req.headers.accept || req.headers.accept.indexOf('text/event-stream') === -1) {
      return next();
    }

    // Restore or create a session for the bin
    var session = utils.sessionForBin(req.bin, true),
        key = utils.keyForBin(req.bin),
        userSession = req.session,
        checksum = req.param('checksum'),
        // cache the bin because req.bin is just a reference and gets changed when
        // the revision gets bumped.
        bin = req.bin,
        keepalive = null,
        close, closeTimer;

    if (isOwnerWithWrite(userSession, bin, checksum) && pendingToKillStreaming[key]) {
      clearTimeout(pendingToKillStreaming[key] || null);
    }

    openSpikes += 1;
    metrics.gauge('spike.open', openSpikes);

    console.log('STREAM ACCEPTED', req.originalUrl);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    });
    res.write('id: 0\n\n');

    session.res.push(res);

    if (req.keepLatest) {
      if (!sessionsFromUser[req.user.name]) {
        sessionsFromUser[req.user.name] = [];
      }
      sessionsFromUser[req.user.name].push({ key: key, res: res });
    }

    keepalive = setInterval(function () {
      if (!res.connection.writable) {
        return close();
      }
      res.write('id: 0\n\n');
    }, 15 * 1000);

    // FIXME this will break when using /rem/last/ as req.bin won't be the same bin anymore.
    var closed = false;

    close = function () {
      if (closed) {
        return;
      }
      closed = true;

      if (isOwnerWithWrite(userSession, bin, checksum)) {
        // this means the owner has disconnected from jsbin, and it's possible
        // that we can remove their write access to the bin (and thus not add
        // streaming to full previews). So we set a timer, and if this eventsource
        // isn't reopened then we assume it's closed. If this eventsource *does*
        // reopen, then we clear the timer, and they can continue to stream.
        pendingToKillStreaming[key] = setTimeout(function () {

          binModel.updateBinData(req.bin, {streaming_key: ''}, function (error) {
            if (error) {
              console.error(error);
            }
          });
        }, 24 * 60 * 1000); // leave it open for 24 hours
      }
      clearInterval(keepalive);
      clearTimeout(closeTimer);
      utils.removeConnection(utils.keyForBin(req.bin), res);
      // ping stats
      spike.ping(req.bin, {}, true);
    };

    // every 5 minutes, let's let them reconnect
    closeTimer = setTimeout(function () {
      res.end();
      req.emit('close');
    }, 15 * 60 * 1000);

    res.socket.on('close', close);
    req.on('close', close);
    res.req = req;

    // ping stats
    spike.ping(req.bin, {}, true);
  },

  /**
   * Reload all connected clients
   */
  reload: function (bin) {
    var session = utils.sessionForBin(bin);

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

  /**
   * Update spikes for URLs like /rem/last to keep the clients up to date with
   * the correct bin. It disassociates the connection (userSession.res) from the
   * old bin's pool via removeConnection. It then gets or creates a session for
   * the new bin and updates the userSession's key.
   */
  updateUserSpikes: function (user, newBin) {
    var newKey = utils.keyForBin(newBin);

    if (!sessionsFromUser[user]) { return; }

    // Update sessions for the user bins if the bin has changed
    sessionsFromUser[user].forEach(function (userSession) {
      var oldBinKey = userSession.key;
      // Is this the same bin? If so, keep it, we're cool.
      if (oldBinKey === newKey) { return; }
      utils.removeConnection(oldBinKey, userSession.res);
      // Create/get a new session for the new bin and add the connection to the
      // new session's res pool
      var newSession = utils.sessionForBin(newBin, true);
      newSession.res.push(userSession.res);
      // Upgrade the user session with the new bin and key
      userSession.res.req.bin = newBin;
      userSession.key = newKey;
    });

  },

  /**
   * Update spikes when a new revision is created.
   */
  bumpRevision: function (oldBin, newBin) {

    if (!newBin || !newBin.url) {
      // FIXME this is just patching a problem, the source of which I'm not sure
      console.error('spike/index.js#bump-revision - missing newBin', newBin);
      return;
    }

    var oldSession = utils.sessionForBin(oldBin),
        oldKey = utils.keyForBin(oldBin),
        newSession = utils.sessionForBin(newBin, true),
        newKey = utils.keyForBin(newBin);

    if (!oldSession) { return; }

    // Move connections from one session to another
    oldSession.res.forEach(function (res) {
      // Add the connection to the new session's list
      newSession.res.push(res);
      // Upgrade the connection with the new bin
      res.req.bin = newBin;
      // Tell the client to bump their revision
      res.write(utils.makeEvent('bump-revision', newKey));
      if (res.ajax) {
        // lets older browsers finish their xhr request
        res.end();
        res.req.emit('close');
      }
      return false;
    });

    // There should be no more connections to this bin, so byebye!
    oldSession.res = [];
    delete sessions[oldKey];

  },

  /**
   * Notify connected clients of an update to a bin
   */
  ping: function (bin, data, statsRequest) {
    var id = bin.id,
        delayTrigger = 500;

    if (!pending[id]) {
      pending[id] = {};
    }

    pending[id].bin = bin;
    pending[id][data.panelId] = utils.process(data, bin.settings);

    // Clear the previous ping
    clearTimeout(pending[id].timer);

    // NOTE: this will only fire once per jsbin session -
    // not for every panel sent - because we clear the timer
    pending[id].timer = setTimeout(function () {
      var session = utils.sessionForBin(bin),
          data = null,
          ping = pending[id];


      if (!ping) { return; }

      // Javascript and HTML cause reloads. CSS is injected.
      data = ping.javascript || ping.html || ping.css || (statsRequest ? {} : false);

      // Forget this ping, it's done with now
      delete pending[id];

      if (!data) { return; }
      if (!session) { return; }

      // Send the update to all connected sessions in original and raw flavours
      session.res.forEach(function (res) {
        var raw = data.raw || data.content;
        if (!res.req.stats) {
          res.write(utils.makeEvent(data.panelId, raw));
          res.write(utils.makeEvent(data.panelId + ':processed', data.content));
        }
        res.write(utils.makeEvent('stats', { connections: session.res.filter(function (res) {
          return !res.req.stats;
        }).length }));
        if (res.ajax && !statsRequest) {
          res.end(); // lets older browsers finish their xhr request
          res.req.emit('close');
        }
      });

    }, delayTrigger);
  },

  appendScripts: function (version, scripts) {
    // TODO this should really detect that there's an active session going
    // on and the user is saving, and therefore include the spike intelligently
    scripts.app.push('js/vendor/eventsource.js?' + version);
    scripts.app.push('js/spike.js?' + version);
  },

  utils: utils
};
