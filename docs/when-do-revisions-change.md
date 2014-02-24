# When do revisions change?

Let's say you've started afresh on jsbin.com. You're welcomed with either your own saved template or the default empty HTML page.

**As soon as you start typing** you recieve your own URL and revision (revision 1) for that code. Let's say that url is `jsbin.com/abcde/1/`

If you continue to type, all your changes are saved under revision 1 of `abcde`.

## When does the revision increment?

There's a few situations that can cause a revision to change, some obvious and simple, some much more subtle and designed to be.

### When you create a new milestone

This will immediately increment the revision, and you will no long be able to save to the previous revision you were on.

### When you "lock revision #X"

The "lock revision #X" is inside the Share menu - which is only available on saved bins.

This doesn't increment the revision right away, but clears your ability to write to the current revision. What does that actually mean?

It means locking prevents *you* from making subsequent changes to the bin. This is useful when you want to share an exact representation of code. When you want to make absolutely sure that revision #X has the code you intended.

Any subsequent key strokes will now *automatically* increament the revision number, and continue to save all your updated code in `jsbin.com/abcde/2/`.

Note that use the keyboard shortcut ctrl+s (or cmd+s on a Mac) has the same effect as locking the revision.

### When you start a fresh session

A "session" is limited to a single window (or more precisely: browser tab), and last only whilst you're on the same URL, such as `jsbin.com/abcde/1/`. If you open a *new* tab to `jsbin.com/abcde/1/`, it's considered a new session, and therefore you don't have write access to the revision #1 bin. So if you begin typing in this new tab, it will *automatically* increment the revision.

So if you close your browser and later return to the same URL (that you might have been editing before), this is considered a new fresh session, and therefore a new revision is created as you begin to type.

### Using keyboard shortcut ctrl+s (or cmd+s on Mac) on an unmodified bin

If you execute this keyboard shortcut and the bin has not been modified at all - and therefore don't have "write access" to the bin, it will automatically increment the revision and you will now own this new revision.

If there is no URL, and are on simply `jsbin.com`, then you will be given a full new URL, such as `jsbin.com/vwxyz/1`.

## What is a revision

Technically the revisions have no real meaning. Since you could in theory only own revision 1, 15 and 36 and none in between (due to perhaps sharing the URL). Equally the *content* in "revision" 1, 15 and 36 could be entirely different and not really represent a revision of one another.

A revision simply indicates that there was a specific starting point, but all subsequent bins on that URL don't have to have a relationship.

That said, it's also quite likely that you create `abcde/1` and share it with me, I make a change that fixes some problem you had, and return `abcde/2` - in this case it might be quite useful to produce a [diff between the two bins](http://www.youtube.com/watch?v=KZd_J8XFxTM) (note that this feature has since been removed but it's something I'd like to bring back to JS Bin 3 with a graphic UI to read the diff).