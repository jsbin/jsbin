# JS Bin V: TODO

## In progress

- [ ] Welcome
- [ ] Handle 404 - and for missing /local/* entries
- [ ] Sign in (API, JWT)

## Bit bugs

- [ ] Make title a prop of Head, rather than multiple `title` els
- [x] Sticky quick setting layout
- [x] Quick commands aren't saving
- [x] Change theme from palette doesn't save (because it toggles to unknown value)


## Themes

- [ ] Dark loading gif

## Console

- [ ] Can the code be run without a try/catch closure to expose the `const`?
- [x] Console!
- [x] Errors need to be passed into console too

## Settings

- [x] Dark theme for .Error
- [x] Check default panel from 'app.source'
- [x] Ensure dirty flag is always picked up
- [x] If undefined command is selected in the palette, it breaks
- [x] Inject live across all tabs
- [x] Tests defaults work in App view
- [x] Support option injection via the "quick settings"
- [x] Fix/change? references to "vertical"

## Larger tasks

- [ ] Embeds (support existing urls - or potentially use embed.js to redirect to different url)
- [ ] Processors
- [ ] Reinstate mobile mirror and mobile support (touch based, not keyboard)

## UI

- [ ] Share box
- [ ] Some kind of notification system
- [x] Loading gif
- [x] Import light + dark theme by default
- [x] Completely dark theme
- [x] Console
- [x] Restore cursor position on insert
- [x] Snippets and snippets from local bins

## UX

- [ ] Support shortcuts (based on lib/commands.js)
- [ ] cmd+enter - run code with alerts, etc
- [ ] Investigate using blobs with scripts for real-time line number reports


## Lib

- [ ] Compile output document in web worker
- [ ] Inject CSS, don't recompile
- [ ] Background save of current state.

## Pages

- [ ] Account
- [x] Settings (json like, ala VS Code)

## API

- [x] Import from gists
- [ ] Save online/share
- [ ] Sync settings
- [ ] Login / upgrade, etc

## To be categorised

- [ ] Help

## Known issues

- [ ] When output is too big, it can't be scrolled vertically?

## Nice to have

- [ ] Hold cmd and hover over keyword, it underlines, and clicking opens a sub panel below the line of code to http://docs.devdocs.io/javascript/global_objects/arraybuffer.html
