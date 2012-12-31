# JS Bin

## Build Process

JS Bin has been designed to work both online at [jsbin.com](http://jsbin.com) but also in your own locally hosted environment - or even live in your own site (if you do host it as a utility, do let us know by pinging [@js_bin](http://twitter.com/js_bin) on twitter).

There's two installation paths: Node (recommended) and PHP.

Historically JS Bin was built on PHP, but has since moved to Node. The PHP flavour does not support the following:

- Remote rendering
- CodeCasting
- Processors

However, everything else released in v3 of JS Bin is available in both.

For detailed instructions on how to build JS Bin in either environment see the [running your own JS Bin document](/remy/jsbin/blob/master/docs/running-your-own-jsbin.md).

If you install [Node.js](http://nodejs.org) installation is easy:

```
$ npm install -g jsbin
$ jsbin
```

Then open your browser to [http://localhost:3000](http://localhost:3000) and you have a fully working version of JS Bin running locally.


## What can JS Bin do?

* Write code and have it both save in real-time, but also render a full preview in real-time
* Help debug other people's JavaScript, HTML or CSS by sharing and editing urls
* CodeCast - where you share what you're typing in JS Bin in real-time
* Remote rendering - view the output of your JS Bin on any device on any platform, updating in real-time
* Processors, including: coffee-script, LESS, Markdown and Jade.
* Debug remote Ajax calls

## About

JS Bin is an open source collaborative web development debugging tool.

## Who built this?

JS Bin was built by [Remy Sharp](http://remysharp.com) and is completely open source and available [http://github.com/remy/jsbin](http://github.com/remy/jsbin). You can also follow [@rem](http://twitter.com/rem) on Twitter where he'll tweet about JavaScript, HTML 5 and other such gems.

If you would like to work with Remy and his company, [Left Logic](http://leftlogic.com) on a front end development project, [please get in touch](http://leftlogic.com/contact?message=Found%20through%20jsbin.com).

UX was kindly donated by [Danny Hope](http://yandleblog.com) who also tweets as [@yandle](http://twitter.com/yandle).

The vast majority of the port from PHP to Node was done by [Aron Carroll](http://aroncarroll.com/) who also plays in github as [@aron](http://github.com/aron).

## A short history

[JS Bin](http://jsbin.com) is a webapp specifically designed to help JavaScript and CSS folk test snippets of code, within some context, and debug the code collaboratively.

JS Bin allows you to edit and test JavaScript and HTML (reloading the URL also maintains the state of your code - new tabs doesn't). Once you're happy you can save, and send the URL to a peer for review or help. They can then make further changes saving anew if required.

The original idea spawned from a conversation with another developer in trying to help him debug an Ajax issue. The original aim was to build it using Google's app engine, but in the end, it was [John Resig](http://ejohn.org)'s [Learning app](http://ejohn.org/apps/learn) that inspired me to build the whole solution in JavaScript with liberal dashes of jQuery and a tiny bit of LAMP for the saving process.

[Version 1](http://1.jsbin.com) of [JS Bin](http://www.flickr.com/photos/remysharp/4284906136) took me the best part of 4 hours to develop [back in 2008](http://remysharp.com/2008/10/06/js-bin-for-collaborative-javascript-debugging/), but [version 2](http://2.jsbin.com) was been rewritten from the ground up and is completely [open source](http://github.com/remy/jsbin).