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
export default class Trie {
  constructor() {
    this.clear();
  }

  /**
   * @param {string} word
   */
  add(word) {
    var node = this._root;
    ++this._wordsInSubtree[this._root];
    for (var i = 0; i < word.length; ++i) {
      var edge = word[i];
      var next = this._edges[node][edge];
      if (!next) {
        if (this._freeNodes.length) {
          // No need to reset any fields since they were properly cleaned up in remove().
          next = this._freeNodes.pop();
        } else {
          next = this._size++;
          this._isWord.push(false);
          this._wordsInSubtree.push(0);
          this._edges.push({ __proto__: null });
        }
        this._edges[node][edge] = next;
      }
      ++this._wordsInSubtree[next];
      node = next;
    }
    this._isWord[node] = true;
  }

  /**
   * @param {string} word
   * @return {boolean}
   */
  remove(word) {
    if (!this.has(word)) return false;
    var node = this._root;
    --this._wordsInSubtree[this._root];
    for (var i = 0; i < word.length; ++i) {
      var edge = word[i];
      var next = this._edges[node][edge];
      if (!--this._wordsInSubtree[next]) {
        delete this._edges[node][edge];
        this._freeNodes.push(next);
      }
      node = next;
    }
    this._isWord[node] = false;
    return true;
  }

  /**
   * @param {string} word
   * @return {boolean}
   */
  has(word) {
    var node = this._root;
    for (var i = 0; i < word.length; ++i) {
      node = this._edges[node][word[i]];
      if (!node) return false;
    }
    return this._isWord[node];
  }

  /**
   * @param {string=} prefix
   * @return {!Array<string>}
   */
  words(prefix) {
    prefix = prefix || '';
    var node = this._root;
    for (var i = 0; i < prefix.length; ++i) {
      node = this._edges[node][prefix[i]];
      if (!node) return [];
    }
    var results = [];
    this._dfs(node, prefix, results);
    return results;
  }

  /**
   * @param {number} node
   * @param {string} prefix
   * @param {!Array<string>} results
   */
  _dfs(node, prefix, results) {
    if (this._isWord[node]) results.push(prefix);
    var edges = this._edges[node];
    for (var edge in edges) this._dfs(edges[edge], prefix + edge, results);
  }

  /**
   * @param {string} word
   * @param {boolean} fullWordOnly
   * @return {string}
   */
  longestPrefix(word, fullWordOnly) {
    var node = this._root;
    var wordIndex = 0;
    for (var i = 0; i < word.length; ++i) {
      node = this._edges[node][word[i]];
      if (!node) break;
      if (!fullWordOnly || this._isWord[node]) wordIndex = i + 1;
    }
    return word.substring(0, wordIndex);
  }

  clear() {
    this._size = 1;
    this._root = 0;
    /** @type {!Array<!Object<string, number>>} */
    this._edges = [{ __proto__: null }];
    /** @type {!Array<boolean>} */
    this._isWord = [false];
    /** @type {!Array<number>} */
    this._wordsInSubtree = [0];
    /** @type {!Array<number>} */
    this._freeNodes = [];
  }
}
