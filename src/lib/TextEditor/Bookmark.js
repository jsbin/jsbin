import { TextRange } from '../common/TextRange';

/**
 * @unrestricted
 */
export class TextEditorBookMark {
  /**
   * @param {!CodeMirror.TextMarker} marker
   * @param {symbol} type
   * @param {!TextEditor.CodeMirrorTextEditor} editor
   */
  constructor(marker, type, editor) {
    console.log(TextEditorBookMark._symbol);
    marker[TextEditorBookMark._symbol] = this;

    this._marker = marker;
    this._type = type;
    this._editor = editor;
  }

  clear() {
    var position = this._marker.find();
    this._marker.clear();
    // if (position) this._editor._updateDecorations(position.line);
  }

  refresh() {
    this._marker.changed();
    var position = this._marker.find();
    // if (position) this._editor._updateDecorations(position.line);
  }

  /**
   * @return {symbol}
   */
  type() {
    return this._type;
  }

  /**
   * @return {?TextUtils.TextRange}
   */
  position() {
    var pos = this._marker.find();
    return pos ? TextRange.createFromLocation(pos.line, pos.ch) : null;
  }
}
