import { TextRange } from '../common/TextRange';
import * as CodeMirrorUtils from '../CodeMirror/Utils';

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

/**
   * @param {string} line
   * @param {number} lineNumber
   * @param {number} column
   * @param {function(string):boolean} isWordChar
   * @return {!TextUtils.TextRange}
   */
export function wordRangeForCursorPosition(
  line,
  lineNumber,
  column,
  isWordChar
) {
  var wordStart = column;
  if (column !== 0 && isWordChar(line.charAt(column - 1))) {
    wordStart = column - 1;
    while (wordStart > 0 && isWordChar(line.charAt(wordStart - 1))) --wordStart;
  }
  var wordEnd = column;
  while (wordEnd < line.length && isWordChar(line.charAt(wordEnd))) ++wordEnd;
  return new TextRange(lineNumber, wordStart, lineNumber, wordEnd);
}

const _lineSeparator = '\n'; // FIXME this should really detect

/**
   * @override
   * @param {!CodeMirror} cm
   * @param {!TextUtils.TextRange=} textRange
   * @return {string}
   */
export function text(cm, textRange) {
  if (!textRange) return cm.getValue(_lineSeparator);
  var pos = CodeMirrorUtils.toPos(textRange.normalize());
  return cm.getRange(pos.start, pos.end, _lineSeparator);
}
