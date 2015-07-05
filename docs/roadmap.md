# Roadmap

- Update subscription page to allow for card changes/expiry
- Email notification of failed Stripe payments
- Design in slimline ad at top of page
- API support
- Organisation support (complex)
- 4.0 release: single user npm install via semantic-release


# Legacy ideas

In no specific order

- Static uploading via zip file: the assets are available via `jsbin.com/static/rem/foo.gif` etc, and dir listing on `jsbin.com/static/rem/` - note that assets should only be requestable from jsbin.com
- Offline support: deliver index.html and the dynamic content through a JSON request, need to make the UI a bit more dynamic (around login/reg). Questions: can you support a) saving, b) opening old bins?
- Timeline scrubbing: need to capture individual changes in a searate increment table (which will be HUGE) (Danny has visuals for this)
- Remove old welcome page in favour of introduction overlay/box - this could integrate with the user's historial bins, but also shows latest videos, links to posts, tweets, etc.
- Fork support - currently we have cloning, I want to be able to trace the history of a bin via it's fork history
- Live error detection in the JS panels
- Smarter share box: Danny has visuals for this too. Includes ability to select which panels you want to share, and picking a specific point in time.
- Co-op editing? Maybe, might be a bit pie-in-the-sky.
- Searching bins. Filtering in your ‘Open’ list, searching across all bins maybe?
- Better mobile experience
- Complete splitter work (currently able to drag splitter to change orientatoin, but it doesn't save)
- Showing process via timeline scrubbing
  - Comments
  - Timestamped comments
  - Timestamped audio comments
- Notification system for local installs to know when an update is available
- Export bins as zip file
- Additional panels (like a readme, or other processors allowing to pipe one panel in to others, and dynamic documentation panel)
- Collections (pre-curated bins)
- Full preview for that bin owner, does not contain injected content, otherwise top/tail with jsbin
- Reverse code casting: give someone a url and watch their code changes
- Show all revisions and forks for a particular bin
- Show all my revisions of a particular bin
- Link training accounts/vanity urls to drive custom template from github repo
