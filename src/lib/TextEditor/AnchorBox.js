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
 * @unrestricted
 */
export default class AnchorBox {
  /**
   * @param {number=} x
   * @param {number=} y
   * @param {number=} width
   * @param {number=} height
   */
  constructor(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
  }

  /**
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  contains(x, y) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }
}

/**
 * @param {!AnchorBox} box
 * @return {!AnchorBox}
 */
AnchorBox.prototype.relativeTo = function(box) {
  return new AnchorBox(this.x - box.x, this.y - box.y, this.width, this.height);
};

/**
 * @param {!Element} element
 * @return {!AnchorBox}
 */
AnchorBox.prototype.relativeToElement = function(element) {
  return this.relativeTo(
    element.boxInWindow(element.ownerDocument.defaultView)
  );
};

/**
 * @param {?AnchorBox} anchorBox
 * @return {boolean}
 */
AnchorBox.prototype.equals = function(anchorBox) {
  return (
    !!anchorBox &&
    this.x === anchorBox.x &&
    this.y === anchorBox.y &&
    this.width === anchorBox.width &&
    this.height === anchorBox.height
  );
};
