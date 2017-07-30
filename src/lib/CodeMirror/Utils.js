import CodeMirror from 'codemirror';
import { TextEditorBookMark } from '../TextEditor/Bookmark';
import { TextRange } from '../common/TextRange';

// Copyright 2014 The Chromium Authors. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//    * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//    * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

export function toPos(range) {
  return {
    start: new CodeMirror.Pos(range.startLine, range.startColumn),
    end: new CodeMirror.Pos(range.endLine, range.endColumn),
  };
}

/**
   * @param {number} lineNumber
   * @param {number} columnNumber
   * @param {!Element} element
   * @param {symbol} type
   * @param {boolean=} insertBefore
   * @return {!TextEditorBookMark}
   */
export function addBookmark(
  cm,
  lineNumber,
  columnNumber,
  element,
  type,
  insertBefore
) {
  var bookmark = new TextEditorBookMark(
    this._codeMirror.setBookmark(new CodeMirror.Pos(lineNumber, columnNumber), {
      widget: element,
      insertLeft: insertBefore,
    }),
    type,
    this
  );
  this._updateDecorations(lineNumber);
  return bookmark;
}

/**
 * @param {!CodeMirror.Pos} start
 * @param {!CodeMirror.Pos} end
 * @return {!TextUtils.TextRange}
 */
export function toRange(start, end) {
  return new TextRange(start.line, start.ch, end.line, end.ch);
}

/**
 * @param {!CodeMirror.ChangeObject} changeObject
 * @return {{oldRange: !TextUtils.TextRange, newRange: !TextUtils.TextRange}}
 */
export function changeObjectToEditOperation(changeObject) {
  var oldRange = toRange(changeObject.from, changeObject.to);
  var newRange = oldRange.clone();
  var linesAdded = changeObject.text.length;
  if (linesAdded === 0) {
    newRange.endLine = newRange.startLine;
    newRange.endColumn = newRange.startColumn;
  } else if (linesAdded === 1) {
    newRange.endLine = newRange.startLine;
    newRange.endColumn = newRange.startColumn + changeObject.text[0].length;
  } else {
    newRange.endLine = newRange.startLine + linesAdded - 1;
    newRange.endColumn = changeObject.text[linesAdded - 1].length;
  }
  return { oldRange: oldRange, newRange: newRange };
}
