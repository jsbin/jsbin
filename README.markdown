# JS Bin

## Build Process

JS Bin is currently designed to work offline in development mode and online in production mode - which should trigger automatically.

This is controlled through the config.php and the `jsbin.js` file that is pulled in.  When offline, this file is generated on the fly through a php version of Sprockets (tweaked by me to support multiple base paths).  The production version will be pre-built, via Sprockets & Google's closure compiler.

## Collaborative JavaScript Debugging

* Test live JavaScript with HTML and CSS context
* Public URLs render outside of JS Bin
* Inject major JavaScript libraries
* Debug remote Ajax calls

## About

JS Bin is an open source collaborative JavaScript debugging tool.

## Who built this?

JS Bin was built by [Remy Sharp](http://remysharp.com) and is completely open source and available [http://github.com/remy/jsbin](http://github.com/remy/jsbin). You can also follow [@rem](http://twitter.com/rem) on Twitter where he'll tweet about JavaScript, HTML 5 and other such gems.
    
If you would like to work with Remy and his company, [Left Logic](http://leftlogic.com) on a front end development project, [please get in touch](http://leftlogic.com/contact?message=Found%20through%20jsbin.com).

UX was kindly donated by [Danny Hope](http://yandleblog.com) who also tweets [here](http://twitter.com/yandle).

## A short history

[JS Bin](http://jsbin.com) is a webapp specifically designed to help JavaScript and CSS folk test snippets of code, within some context, and debug the code collaboratively.

JS Bin allows you to edit and test JavaScript and HTML (reloading the URL also maintains the state of your code - new tabs doesn't). Once you're happy you can save, and send the URL to a peer for review or help. They can then make further changes saving anew if required.

The original idea spawned from a conversation with another developer in trying to help him debug an Ajax issue. The original aim was to build it using Google's app engine, but in the end, it was [John Resig](http://ejohn.org)'s [Learning app](http://ejohn.org/apps/learn) that inspired me to build the whole solution in JavaScript with liberal dashes of jQuery and a tiny bit of LAMP for the saving process.

[Version 1 of JS Bin](http://www.flickr.com/photos/remysharp/4284906136) took me the best part of 4 hours to develop, but version 2, this version, has been rewritten from the ground up and is completely [open source](http://github.com/remy/jsbin).