# JS Bin V: TODO

## In progress

- [ ] Inject CSS, don't recompile
- [x] Local save is losing the language
- [x] Prevent initial focus on `autofocus`
- [x] Console isn't attached to iframe…

## Need for live

- [ ] Pay/cancel/renew
- [/] Analytics
- [x] Logout
- [x] Loop protection (with babel rewrite)
- [x] Login (though wants some love)
- [x] Processors

## Bit bugs

- [ ] new doesn't reset the previous result
- [ ] Expose every feature through the palette
- [ ] `white-space` in CSS puts colour picker on `white`
- [ ] Saving Markdown kills all the spaces
- [ ] Resize the output (when it's not scrollable), and when output is too big, it can't be scrolled vertically
- [ ] Why does the settings have 4 indents and save to 2? And the weird tabbing?
- [ ] Change settings, and in other panel change a setting and original settings are lost (low priority)
- [x] Make bin logo red when there's an error
- [x] Babel parsing error when trying loop protect doesn't bubble up (see production)
- [x] Race condition in console: sometimes the console has finished loading before the Console component is loaded
- [x] Dark theme not working on console (needs to listen for theme event and add class)
- [x] Import CSS and it's put as a script
- [x] Open missing
- [x] cmd+enter should re-run code
- [x] Notifications sit *under* the editor
- [x] URL linking to highlighted lines
- [x] From &result=page switch to console doesn't load up console
- [x] Skip welcome if we're embedded
- [x] Linking to an existing url (https://v5.jsbin.com/gist/07ba1ea3d53decd293f49e543894c938) for the first time gives me the welcome page, then I lose the link
- [x] Palette: "type `add`, then delete, you're left with `a`"
- [x] Totally wrong cdnjs files!!!
- [x] Select last palette option is wrong
- [x] Some kind of notification system
- [x] Meta data in open
- [x] Open a bin with CSS + JS and it doesn't include that in the initial render
- [x] If console is open by default, then it takes focus
- [x] New is broken
- [x] Open is broken / Palette is broken
- [x] Make title a prop of Head, rather than multiple `title` els
- [x] Handle 404 - and for missing /local/* entries
- [x] Sticky quick setting layout
- [x] Quick commands aren't saving
- [x] Change theme from palette doesn't save (because it toggles to unknown value)

## Account

- [ ] Clean up sign in
- [ ] Purchase license
- [ ] Refresh token
- [ ] Prompt for license purchase
- [ ] Upgrade pages
- [ ] Handle subscription renewal
- [ ] Validate session on load

## License



## Themes

- [ ] Dark loading gif (low priority)
- [x] Dark welcome/document theme

## Console

- [x] Can the code be run without a try/catch closure to expose the `const`? (no, tested)
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

- [ ] a11y
- [/] Embeds (support existing urls - or potentially use embed.js to redirect to different url)
- [ ] Reinstate mobile mirror and mobile support (touch based, not keyboard)
- [x] Processors

## Security

- [x] Secure output
- [x] Secure: show/hide output
- [x] Secure: test console works
- [x] Secure: build
- [x] Secure: push errors back to editor
- [x] Secure: change layout
- [x] Secure: show/hide console
- [x] Secure: reduce reducers

## UI

- [ ] Let user decide where to save by default
- [ ] Share box
- [ ] Add meta data box
- [x] Some kind of notification system
- [x] Welcome
- [x] Loading gif
- [x] Import light + dark theme by default
- [x] Completely dark theme
- [x] Console
- [x] Restore cursor position on insert
- [x] Snippets and snippets from local bins

## UX

- [ ] ctrl+l to clear console
- [ ] open - can search by bin name
- [/] cmd+enter - run code with alerts, etc
- [ ] prevent alert, prompt, etc.
- [ ] Bus to handle keyboard shortcuts (that accepts dispatch and state aka: thunk)
- [ ] unfurl - can this even work if there's no dynamic server side?
- [ ] Template support
- [x] `:g` goto line
- [x] Sign in (API, JWT)
- [x] Protect keybindings (ref [#3035](https://github.com/jsbin/jsbin/issues/3035))
- [x] Investigate using blobs with scripts for real-time line number reports

## Lib

- [ ] Compile output document in web worker (nice to have) ([workerize](https://github.com/developit/workerize))
- [ ] Inject CSS, don't recompile

## Pages

- [ ] Account
- [x] Settings (json like, ala VS Code)

## API

- [x] Import from gists
- [x] Export gist (currently anon only…)
- [x] Save online/share
- [ ] Sync settings
- [ ] Login / upgrade, etc

## To be categorised

- [ ] Help
- [ ] Service worker to support /local/x.js requests

## Nice to have

- [ ] Hold cmd and hover over keyword, it underlines, and clicking opens a sub panel below the line of code to http://docs.devdocs.io/javascript/global_objects/arraybuffer.html
- [ ] i18n


## The Remy User

Why build JS Bin V at all?

### 1. I want to be able to try some code out and throw it away (out of mind)

This is achieve through local saving and potentially clearing my local browser cache.

### 2. I want to be able to help other people with their code

I want to save a few steps from start of their code to the final code design and include notes on why I made changes.

### 3. I want to practice coding and pull it up later in time

I should be able to tag or describe a bin to find it again. Perhaps use code snippets to search, or have some visual way to find bins again - perhaps highlight a specific line? #metadata
