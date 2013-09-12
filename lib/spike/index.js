var parse   = require('url').parse,
    querystring = require('querystring').parse,
    processors = require('../processors'),
    _ = require('underscore');

var utils = {},
    sessions = {},
    sessionsFromUser = {},
    pending = {};

var metrics = require('../metrics'),
    open = 0;

setInterval(function () {
  pending = {};
}, 15 * 60 * 1000);

/**
 * Remove a response object from the list associated with the id passed.
 */
utils.removeConnection = function (id, res) {
  if (!sessions[id]) return;
  var responses = sessions[id].res,
      index = responses.indexOf(res);

  if (index === -1) return;

  responses.splice(index, 1);

  // Update the metrics
  open -= 1;
  if (open < 0) open = 0;
  metrics.gauge('spike.open', open);

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

/**
 * Turn some data (a string or object) into an event-source data & event string.
 */
utils.makeEvent = function (eventName, data) {
  if (!eventName) return '';
  var str = '';
  if (typeof data !== 'string') data = JSON.stringify(data);
  if (data) str += 'data: ' + (''+data).split('\n').join('\ndata: ');
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
  if (!processorSettings) return data;
  // Get the name of the currently used processor
  var processorName = processorSettings[data.panelId];
  if (!processorName) return data;
  // Find this processor in the list of processors
  if (!processors[processorName]) return newData;
  // And process!
  var newData = _.clone(data);
  newData.raw = data.content;
  newData.content = processors[processorName](data.content);
  return newData;
};

module.exports = {
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
        keepalive = null,
        close, closeTimer;

    open += 1;
    metrics.gauge('spike.open', open);
    console.log('STREAM ACCEPTED', req.originalUrl, req.headers['user-agent']);

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
      sessionsFromUser[req.user.name].push({ key: utils.keyForBin(req.bin), res: res });
    }

    keepalive = setInterval(function () {
      res.write('id: 0\n\n');
    }, 15 * 1000);

    // FIXME this will break when using /rem/last/ as req.bin won't be the same bin anymore.
    close = function () {
      clearInterval(keepalive);
      clearTimeout(closeTimer);
      utils.removeConnection(utils.keyForBin(req.bin), res);
    };

    // every 5 minutes, let's let them reconnect
    closeTimer = setTimeout(function () {
      res.end();
      req.emit('close');
    }, 15 * 60 * 1000);

    res.socket.on('close', close);
    req.on('close', close);
    res.req = req;
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

    if (!sessionsFromUser[user]) return;

    // Update sessions for the user bins if the bin has changed
    sessionsFromUser[user].forEach(function (userSession) {
      var oldBinKey = userSession.key;
      // Is this the same bin? If so, keep it, we're cool.
      if (oldBinKey === newKey) return;
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

    if (!oldSession) return;

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
  ping: function (bin, data) {
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

      if (!session) return;

      if (!ping) return;

      // Javascript and HTML cause reloads. CSS is injected.
      data = ping.javascript || ping.html || ping.css;
      if (!data) return;

      // Forget this ping, it's done with now
      delete pending[id];

      // Send the update to all connected sessions in original and raw flavours
      session.res.forEach(function (res) {
        var raw = data.raw || data.content;
        res.write(utils.makeEvent(data.panelId, raw));
        res.write(utils.makeEvent(data.panelId + ':processed', data.content));
        res.write(utils.makeEvent('stats', { connections: session.res.length }));
        if (res.ajax) {
          res.end(); // lets older browsers finish their xhr request
          res.req.emit('close');
        }
      });

    }, delayTrigger);
  },

  appendScripts: function (version, scripts) {
    // TODO this should really detect that there's an active session going
    // on and the user is saving, and therefore include the spike intelligently
    scripts.push('js/vendor/eventsource.js?' + version);
    scripts.push('js/spike.js?' + version);
  },

  utils: utils
};