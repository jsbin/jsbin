var parse   = require('url').parse,
    querystring = require('querystring').parse,
    sessions = {};

function removeConnection(id, res) {
  var i = sessions[id].res.indexOf(res);
  if (i !== -1) {
    sessions[id].res.splice(i, 1);
  }
}

function keyForBin(bin) {
  return bin.url + '/' + bin.revision;
}

function sessionForBin(bin) {
  return sessions[keyForBin(bin)];
}

module.exports = {
  getLog: function (req, res) {
    var id = req.params.id, log;
    res.writeHead(200, {'Content-Type': 'text/html', 'Cache-Control': 'no-cache'});
    log = sessions[id] ? sessions[id].log.join('\n<li>') : '<li>No session';
    res.end('<!DOCTYPE html><html><title>\n' + id + '</title><body><ul><li>' + log);
  },

  postLog: function (req, res) {
    // post made to send log to jsconsole
    var id = req.params.id;
    // passed over to Server Sent Events on jsconsole.com
    if (sessions[id]) {
      sessions[id].log.push('message: ' + req.body.data);
    }

    res.writeHead(200, { 'Content-Type' : 'text/plain' });
    res.end();
  },

  // listening stream
  getStream: function (req, res, next) {
    var session = sessionForBin(req.bin);

    if (req.headers.accept === 'text/event-stream') {
      res.writeHead(200, {'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache'});
      res.write('id\n\n');
      if (!session) {
        session = sessions[keyForBin(req.bin)] = { res: [], log: [] };
      }
      session.res.push(res);

      req.on('close', function () {
        session.log.push('disconnect: ' + req.headers['user-agent']);
        removeConnection(keyForBin(req.bin), res);
      });
    } else {
      next();
    }
  },

  ping: function (bin, data) {
    var session = sessionForBin(bin);
    if (session) {
      session.res.forEach(function (response) {
        response.write('data:' + data.content.split('\n').join('\ndata:') + '\nevent:' + data.panelId + '\n\n');
        if (response.xhr) {
          response.end(); // lets older browsers finish their xhr request
        }
      });
    }
  }
};
