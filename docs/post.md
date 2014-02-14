# JS Bin v3: built for sharing, education and real-time

## What is a JS Bin?

JS Bin was one of the very first public paste bins with the output rendered live in your browser and available to share and edit with the completed output. [Released back in 2008](http://remysharp.com/2008/10/06/js-bin-for-collaborative-javascript-debugging/), JS Bin is now on its third iteration and finally includes some of the original features I wanted to build JS Bin with.  It's completely free to use all its features, and it's completely open source and [available on Github](http://github.com/remy/jsbin).

JS Bin exists for two core reasons: 1) creating test and debug cases, and collaboratively debugging those cases. 2) to teach and learn from.

As someone who runs workshops and speaks at conferences, I've always wanted a tool that I could run a live coding session with, where all the delegates could simply visit a URL and that rendered output (or even the edit view) would update in *real-time*. This is the biggest change to JS Bin and was the driving factor to move from PHP to Node.js on the server side.

## What's new?

In both [version 2](http://2.jsbin.com) and version 3 of JS Bin (here's [version 1](http://1.jsbin.com) for reference), the UX has been a big part of the update. [Danny Hope](http://twitter.com/yandle) volunteered his UX experience to this open source project and collaborated very closely with me, allowing us to instantly try out UX ideas, see them in action and decide whether they worked or not.

Again, in the spirit of open source collaboration, the project needed to be upgraded from entirely PHP (and not great PHP code!) to Node.js. [Aron Carroll](http://twitter.com/ac94) worked for the last few months in his spare time to convert the existing JS Bin logic entirely to JavaScript - so as of today, JS Bin is 100% JavaScript.

This move to Node allows us to introduce two new super cool features:

1. CodeCasting
2. Live remote rendering

Both these techniques use EventSource and a little technique that I called [The Spike](https://github.com/jsbin/jsbin/blob/feature/node/public/js/spike.js).

The big key difference between old JS Bin and new JS Bin is that *as you type - JS Bin is saving*. So as soon as your first key stroke lands, you've got your own URL. You keep typing: it keeps saving. If you want to stop saving against that version, just create a milestone, and live saving will be applied to the new revision.

### CodeCasting

CodeCasting is one of the original features I wanted to see in JS Bin. Say you're running a demonstration or a workshop, and you want all those people attending to see the code updated *as you type*. Not only that, but they can see the output of the JavaScript, CSS and HTML...*as you type*.

You don't have to be on the same connection. They can just visit the same URL as you, except that instead of ending the URL with "/edit" we add "/watch" and they become voyeurs to your live coding. I'd love to see this live at a conference.

### Live remote rendering

Ever wanted to check the output on multiple platforms: Firefox, Chrome, IE, iPads, Androids, Windows Phone, even a Boot 2 Gecko phone? Maybe all at once? Maybe without ever hitting refresh?

JS Bin can do this. Simply point the device or browser to your full preview URL (basically removing "/edit" from the URL) and any changes you make, *as you type* will cause the target device to refresh its content.

The URL structure even has a shortcut if you're [registered](http://jsbin.com/#register) you can always point the URL to [http://jsbin.com/<username>/last](http://jsbin.com/rem/last) and it'll pull up the last bin you've worked on.

Along with live remote rendering, I've been working with the Adobe Shadow team and they've gone ahead and built in compatability with JS Bin directly into Shadow. This  simply means that when you visit jsbin.com on your desktop, Shadow will automatically show you the rendered output ([here's a demo with their beta software]()).

### How the live stuff works

It's pretty simple really. In fact, there's a very *very* early version of JS Bin 1, I tried out a [comet](http://en.wikipedia.org/wiki/Comet_(programming)) PHP based version of CodeCasting which was way, way more complicated. It worked, but releasing wasn't possible as my server couldn't take more than just a few concurrent sessions. The move to Node some 4 years later fixes that.

As you type, we send an Ajax save request (after an idle time of 200ms). On the server side, this triggers an event that says "the bin with *this* url has just changed".

When viewing the CodeCasting URL or the live remote rendering, each user is connected to our Spike program. This listens for the event that says a bin has changed, and when that happens, it just finds all the users watching a particular url, and sends them the updated panel (so we only send the CSS panel if the CSS panel changed).

An [EventSource](http://html5doctor.com/server-sent-events/) maintains a persistent connection with the server and is listening for those events in the browser. When the event is recieved, depending on the content type, it'll either inject the content live, or refresh the page giving you the latest code.



## Other important features

Some of these features were always part of JS Bin, but hidden inside of the "beta" access - which required a clunkly console command. Now JS Bin 3 adds the much needed UI to do simple things like login to remember your history of bins.

- Login to remember your history
- Your full history on a single page with live previews on hover
- An API to control default settings (useful if you're preparing a teaching session)
- Processors, so you can use Markdown, CoffeeScript and LESS, amongst others
- CSS panel (after much demand!)
- Console panel (after [@rwaldron's mockup](https://twitter.com/rwaldron/status/179568063660826624) he sent me via Twitter)
- A load more libraries supported (including Bootstrap, Backbone, etc)
- Native support in [Adobe Shadow](http://labs.adobe.com/technologies/shadow/) (that's right, point your browser to JS Bin and Adobe Shadow will render the live output automatically)
-
- Our badass robot mascot: Dave, the JS Bin Bot (stickers will be made!)

![Dave](http://3.jsbin.com/images/logo.png)

## What's coming next?

[TODO - i.e. I've got to write this for the article]

- Github auto log in and export to gist
- Export all previous saved bins (in a single zip file)
- Exposing more of JS Bin's API
- Hosting of personal static assets to include in tests (like common images you might use)














