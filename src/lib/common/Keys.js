import { isMac } from '../is-mac';
export const Keys = {
  Backspace: { code: 8, name: '\u21a4' },
  Tab: { code: 9, name: { mac: '\u21e5', other: 'Tab' } },
  Enter: { code: 13, name: { mac: '\u21a9', other: 'Enter' } },
  Shift: { code: 16, name: { mac: '\u21e7', other: 'Shift' } },
  Ctrl: { code: 17, name: 'Ctrl' },
  Esc: { code: 27, name: 'Esc' },
  Space: { code: 32, name: 'Space' },
  PageUp: { code: 33, name: { mac: '\u21de', other: 'PageUp' } }, // also NUM_NORTH_EAST
  PageDown: { code: 34, name: { mac: '\u21df', other: 'PageDown' } }, // also NUM_SOUTH_EAST
  End: { code: 35, name: { mac: '\u2197', other: 'End' } }, // also NUM_SOUTH_WEST
  Home: { code: 36, name: { mac: '\u2196', other: 'Home' } }, // also NUM_NORTH_WEST
  Left: { code: 37, name: '\u2190' }, // also NUM_WEST
  Up: { code: 38, name: '\u2191' }, // also NUM_NORTH
  Right: { code: 39, name: '\u2192' }, // also NUM_EAST
  Down: { code: 40, name: '\u2193' }, // also NUM_SOUTH
  Delete: { code: 46, name: 'Del' },
  Zero: { code: 48, name: '0' },
  H: { code: 72, name: 'H' },
  N: { code: 78, name: 'N' },
  P: { code: 80, name: 'P' },
  Meta: { code: 91, name: 'Meta' },
  F1: { code: 112, name: 'F1' },
  F2: { code: 113, name: 'F2' },
  F3: { code: 114, name: 'F3' },
  F4: { code: 115, name: 'F4' },
  F5: { code: 116, name: 'F5' },
  F6: { code: 117, name: 'F6' },
  F7: { code: 118, name: 'F7' },
  F8: { code: 119, name: 'F8' },
  F9: { code: 120, name: 'F9' },
  F10: { code: 121, name: 'F10' },
  F11: { code: 122, name: 'F11' },
  F12: { code: 123, name: 'F12' },
  Semicolon: { code: 186, name: ';' },
  NumpadPlus: { code: 107, name: 'Numpad +' },
  NumpadMinus: { code: 109, name: 'Numpad -' },
  Numpad0: { code: 96, name: 'Numpad 0' },
  Plus: { code: 187, name: '+' },
  Comma: { code: 188, name: ',' },
  Minus: { code: 189, name: '-' },
  Period: { code: 190, name: '.' },
  Slash: { code: 191, name: '/' },
  QuestionMark: { code: 191, name: '?' },
  Apostrophe: { code: 192, name: '`' },
  Tilde: { code: 192, name: 'Tilde' },
  LeftSquareBracket: { code: 219, name: '[' },
  RightSquareBracket: { code: 221, name: ']' },
  Backslash: { code: 220, name: '\\' },
  SingleQuote: { code: 222, name: '\'' },
  get CtrlOrMeta() {
    // "default" command/ctrl key for platform, Command on Mac, Ctrl on other platforms
    return isMac ? this.Meta : this.Ctrl;
  },
};

export default Keys;
