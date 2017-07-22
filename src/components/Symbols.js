import React from 'react';
import { isMac } from '../lib/is-mac';

export const Ctrl = () =>
  <span>
    {isMac ? '⌃' : 'Ctrl'}
  </span>;

export const Command = () =>
  <span>
    {isMac ? '⌘' : 'Ctrl'}
  </span>;

export const Shift = () =>
  <span>
    {isMac ? '⇧' : 'Shift'}
  </span>;

export const Alt = () =>
  <span>
    {isMac ? '⌥' : 'Alt'}
  </span>;

export const Esc = () =>
  <span>
    {isMac ? '⎋' : 'Esc'}
  </span>;
