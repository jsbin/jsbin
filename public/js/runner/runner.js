/** ============================================================================
 * JS Bin Runner
 * Accepts incoming postMessage events and updates a live iframe accordingly.
 * ========================================================================== */
/*globals sandbox loopProtect window alert */
var runner = (function () {
  'use strict';
  var runner = {};

  /**
   * Update the loop protoction hit function to send an event up to the parent
   * window so we can insert it in our error UI
   */
  loopProtect.hit = function (line) {
	var message = 'Exiting potential infinite loop at line ' + line + 
	    '. To disable loop protection: add "// noprotect" to your code';
    console.warn(message);
    runner.postMessage('showIssue', {
		type: 'loopProtect', 
		line: line,
		severity: 'warning',
		message: message});
  }

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
    if (!('console' in window)) {return alert(args.join(' '));}
    //window.console.error.apply(console, args);
  };

  /**
   * Handle all incoming postMessages to the runner
   */
  runner.handleMessage = function (event) {
    if (!event.origin) {return;}
    var data = event.data;
    try {
      data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
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


  runner.showErrorIfLocal = function (msg, url, line, col, error) {
	var path = window.parent.location.pathname;
	var cut = path.indexOf('/', 1);
	var fileName = path.substring(1, cut) + '.js';
	var data = {
      severity: 'error',
	  line: line,
	  message: msg,
	  type: 'runtimeError'
	};
	
    window.console.log('$$$ ', msg, "url:", url, line, col, error, "fileName:" + fileName);

	/*
	if (url == fileName || url.substr(-7) === '/runner') {
	  runner.postMessage('showIssue', data);
	  return;
    }
    */
	// If the top source is not the local file, scan the stack trace
	// We can only scan the stack trace if we have one.
    if (!error || !error.stack) {
      return;
    }	
    var found = false;
    var stack = error.stack.split('\n');
    var scanFor = fileName + ':';
    window.console.log('$$$ stack:', stack, "len:", stack.length, "scanFor", scanFor);
	for (var i = 0; i < stack.length; i++) {
	  var line = stack[i].trim();
	  var start = line.indexOf(scanFor);
	  
	  window.console.log("line", line, "start", start);
	  
      if (start != -1 && start < 5) {
		
	    var end = line.indexOf(':', start + scanFor.length);
	    
	    var lineStr = line.substring(start + scanFor.length, end);
	    
	    window.console.log("end", end, "lineStr", lineStr);
	    
		data.line = parseInt(line.substring(start + scanFor.length, end));
        runner.postMessage('showIssue', data);
	    break;
	  }
    }
  }

  /**
   * Render a new preview iframe using the posted source
   */
  runner.render = function (data) {
    // if we're just changing CSS, let's try to inject the change
    // instead of doing a full render
    if (data.options.injectCSS) {
      if (sandbox.active) {
        var style = sandbox.active.contentDocument.getElementById('jsbin-css');
        if (style) {
          style.innerHTML = data.source;
          return;
        }
      }
    }

    var iframe = sandbox.create(data.options);
    sandbox.use(iframe, function () {
      var childDoc = iframe.contentDocument,
          childWindow = getIframeWindow(iframe);
      if (!childDoc) childDoc = childWindow.document;

      // Reset the console to the prototype state
      proxyConsole.methods.forEach(function (method) {
        delete proxyConsole[method];
      });


      // Process the source according to the options passed in
      var source = processor.render(data.source, data.options);

      // Start writing the page. This will clear any existing document.
      childDoc.open();

      // We need to write a blank line first – Firefox blows away things you add
      // to the child window when you do the fist document.write.
      // Note that each document.write fires a DOMContentLoaded in Firefox.
      // This method exhibits synchronous and asynchronous behaviour, depending
      // on the browser. Urg.
      childDoc.write('');

      // Give the child a reference to things it needs. This has to go here so
      // that the user's code (that runs as a result of the following
      // childDoc.write) can access the objects.
      childWindow.runnerWindow = {
        proxyConsole: proxyConsole,
        protect: loopProtect,
      };

      childWindow.console = proxyConsole;

      // Reset the loop protection before rendering
      loopProtect.reset();

      // if there's a parse error this will fire
      childWindow.onerror = function (msg, url, line, col, error) {
        // show an error on the jsbin console, but not the browser console
        // (i.e. use _raw), because the browser will throw the native error
        // which (hopefully) includes a link to the JavaScript VM at that time.
        proxyConsole._raw(error && error.stack ? error.stack : msg + ' (line ' + line + ')');

        // Also highlight the error in code mirror if we can identify the location.        
        runner.showErrorIfLocal(msg, url, line, col, error);
      };

      // Write the source out. IE crashes if you have lots of these, so that's
      // why the source is rendered above (processor.render) – it should be one
      // string. IE's a sensitive soul.
      childDoc.write(source);
      // childDoc.documentElement.innerHTML = source;

      // Close the document. This will fire another DOMContentLoaded.
      childDoc.close();
      runner.postMessage('complete');

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
