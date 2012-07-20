# JS Bin v3: built for sharing, education and real-time

## What is a JS Bin?

JS Bin was one of the very first public paste bins with the output rendered live in your browser and available to share and edit with the completed output. [Released back in 2008](), JS Bin is now on it's third iteration and finally includes some of the original features I wanted to build JS Bin with.  It's completely free to use all it's features, and it's completely open source and [available on Github]().

JS Bin exists for two core reasons: 1) creating test and debug cases, and collaboratively debugging those cases. 2) to teach and learn from.

As someone who runs workshops and speaks at conferences, I've always wanted a tool that I could run a live coding session with, but all the delegates could simply visit a URL and that rendered output (or even the edit view) would update in *real-time*. This is the biggest change to JS Bin and was the driving factor to move from PHP to Node.js on the server side.

## What's new?

In both [version 2](http://2.jsbin.com) and version 3 of JS Bin (here's [version 1](http://1.jsbin.com) for reference), the UX has been a big part of the update. [Danny Hope]() volunteered his UX experience to this open source project and collaborated very closely with me allowing us to instantly try out UX ideas, see them in action and decide whether they worked or not.

Again in the spirit of open source collaboration, the project needed to be upgraded from entirely PHP (and not great PHP code!) to Node.js. [Aron Carroll]() worked for the last few months in his spare time converting the existing JS Bin logic entirely to JavaScript - so as of today, JS Bin is 100% JavaScript.

This move to Node allows us to introduce two new super cool features:

1. CodeCasting
2. Live remote rendering

Both these techniques use EventSource and a little technique that I called [The Spike](https://github.com/remy/jsbin/blob/feature/node/public/js/spike.js).

The big key difference between old JS Bin and new JS Bin is that *as you type - JS Bin is saving*. So as soon as your first key stroke lands, you've got your own URL. You keep typing: it keeps saving. If you want to stop saving against that version, just create a milestone, and live saving will be applied to the new revision.

### CodeCasting

CodeCasting is one of the original features I wanted to see in JS Bin. Say you're running a demonstration or a workshop, and you want all those people attending to see the code updated *as you type*. Not only that, but they can see the output of the JavaScript, CSS and HTML...*as you type*. 

You don't have to be on the same connection, just visit the same URL as you, but instead of ending the URL with "/edit" we add "/watch" and they become voyeurs to your live coding. I'd love to see this live at a conference.

### Live remote rendering

Ever wanted to check the output on multiple platforms: Firefox, Chrome, IE, iPads, Androids, Windows Phone, even a Boot 2 Gecko phone? Maybe all at a once? Maybe without ever hitting refresh? 

JS Bin can do this. Simply point the device or browser to your full preview URL (basically removing "/edit" from the URL) and any changes you make, *as you type* will cause the target device to refresh it's content.

The URL structure even has a shortcut if you're [registered](http://jsbin.com/#register) you can always point the URL to [http://jsbin.com/<username>/last](http://jsbin.com/rem/last) and it'll pull up the last bin you've worked on.

### Other important features

Some of these features were always part of JS Bin, but hidden inside of the "beta" access - which required a clunkly console command. Now JS Bin 3 adds the much needed UI to do simple things like login to remember your history of bins.

- Login to remember your history
- Your full history on a single page with live previews on hover
- An API to control default settings (useful if you're preparing a teaching session)
- Processors, so you can use Markdown, CoffeeScript and LESS, amongst others
- CSS panel (after much demand!)
- Console panel (after [@rwaldron's mockup](https://twitter.com/rwaldron/status/179568063660826624) he sent me via Twitter)
- A load more libraries supported (including Bootstrap, Backbone, etc)
- Native support in [Adobe Shadow](http://labs.adobe.com/technologies/shadow/) (that's right, point your browser to JS Bin and Adobe Shadow will render the live output automatically)
- Selectively including live JavaScript
- Our badass robot mascot: Dave, the JS Bin Bot (stickers will be made!)

![Dave](http://3.jsbin.com/images/logo.png)

## What's coming next?

[TODO - i.e. I've got to write this for the article]

- Github auto log in and export to gist
- Export all previous saved bins (in a single zip file)
- Exposing more of JS Bin's API
- Hosting of personal static assets to include in tests (like common images you might use)














