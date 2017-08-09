# Autocomplete logic

_Concept based on Chrome devtool's._

## Tools

Both via Google - possible to rewrite or find alternatives?

- `Trie` for word searching
- `Dictionary` for word entry/add/delete etc

## Tracked events

- `onCursorActivity` - ?
- `onChange` - to use the Trie to find machine autocomplete options, and present them
- `onBeforeChange(cm, changeObj)` - track the `changeObj.to/from` and clear the Trie for the given lines

## CM Methods

- When the `head` of the cursor is clear, put the `hint` element in CodeMirror and show the hint using `cm.setBookmark` (similarly this can be used for colours)
