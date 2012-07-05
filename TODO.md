# TODO

# v3 alpha - hitlist

# misc

- think about url structure (currently /edit/live is now /live)
- detect stubbed out bin (where there's no longer an active key to write), and don't deliver the spike on those bins
- preprocessor UI
- preprocessor support on server side - jsbin.com/abc.less (raw less), jsbin.com/abc.css (compiled CSS)
- screencasts!
- static uploads for users
- remove bin from my history
- 


# URLs

/ref http://www.flickr.com/photos/remysharp/6859356800/

- /latest is fixed - not redirected
- If I'm on /latest, any new updates, notify me and I can reload/live refresh if I want
- Rewind? Possibly not.

# Code Casting

- Add data to report number of connected users
- Add visual cue that you're following

# Panels

- UI for pre-rendering
- "insertionPoint" means we can have more panels

# Save

- Add gist support back in (but do it server side) - support Lea's dabblet format (but files named jsbin.html, etc)
- Fork (as well as clone) and folk allows me to trace this heirachy of bins saved to get to this point

# Misc

- Expose API for specific tasks:
  - prefilters for panels
  - codemirror config
  - jsbin settings (key mappings?)
- Humans.txt

# IE

- Gutter is being rendered thick if the panel isn't visible - possibly solution, only render CM when made visible - problem is the .getCode won't work - so need to think about how to get around it.