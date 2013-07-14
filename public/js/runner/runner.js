/** ============================================================================
 * JS Bin Runner
 * Accepts incoming postMessage events and updates a live iframe accordingly.
 * ========================================================================== */

var runner = (function () {

  var runner = {};

  /**
   * Store what parent origin *should* be
   */
  runner.parent = {};
  runner.parent.origin = '*';

  /**
   * Log error messages, indicating that it's from the runner.
   */
  runner.error = function () {
    var args = ['Runner:'].concat([].slice.call(arguments));
    if (!('console' in window)) return alert(args.join(' '));
    window.console.error.apply(console, args);
  };

  /**
   * Handle all incoming postMessages to the runner
   */
  runner.handleMessage = function (event) {
    if (!event.origin) return;
    var data = event.data;
    try {
      data = JSON.parse(event.data);
    } catch (e) {
      return runner.error('Error parsing event data:', e.message);
    }
    if (typeof runner[data.type] !== 'function') {
      return runner.error('No matching event handler:', data.type);
    }
    runner.parent.source = event.source;
    try {
      runner[data.type](data.data);
    } catch (e) {
      runner.error(e.message);
    }
  };

  /**
   * Send message to the parent window
   */
  runner.postMessage = function (type, data) {
    if (!runner.parent.source) {
      return runner.error('No postMessage connection to parent window.');
    }
    runner.parent.source.postMessage(JSON.stringify({
      type: type,
      data: data
    }), runner.parent.origin);
  };

  /**
   * Render a new preview iframe using the posted source
   */
  runner.render = function (data) {
    var iframe = sandbox.create(data.options);
    sandbox.use(iframe, function () {
      var childDoc = iframe.contentDocument || iframe.contentWindow.document;
          childWindow = childDoc.defaultView || childDoc.parentWindow;
      // Give the child a reference to this window
      childWindow.runnerWindow = window;
      // Process the source according to the options passed in
      var source = processor.render(data.source, data.options);
      childDoc.open();
      // Only one childDoc.write. IE crashes if you have lots.
      childDoc.write(source);
      childDoc.close();
      // Setup the new window
      sandbox.wrap(childWindow, data.options);
    });
  };

  /**
   * Run console commands against the iframe's scope
   */
  runner['console:run'] = function (cmd) {
    sandbox.eval(cmd);
  };

  /**
   * Load script into the apge
   */
  runner['console:load:script'] = function (url) {
    sandbox.injectScript(url, function (err) {
      if (err) return runner.postMessage('console:load:script:error', err);
      runner.postMessage('console:load:script:success', url);
    });
  };

  /**
   * Load DOM into the apge
   */
  runner['console:load:dom'] = function (html) {
    sandbox.injectDOM(html, function (err) {
      if (err) return runner.postMessage('console:load:dom:error', err);
      runner.postMessage('console:load:dom:success');
    });
  };

  return runner;

}());