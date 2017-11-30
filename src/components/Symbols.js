import React from 'react';
import { isMac } from '../lib/is-mac';
const className = isMac ? 'symbol' : '';

export const Backspace = () =>
  <span className={className}>
    {isMac ? '⌫' : 'Backspace'}
  </span>;

export const Ctrl = () =>
  <span className={className}>
    {isMac ? '⌃' : 'Ctrl'}
  </span>;

export const Command = () =>
  <span className={className}>
    {isMac ? '⌘' : 'Ctrl'}
  </span>;

export const Enter = () =>
  <span className={className}>
    {'↵'}
  </span>;

export const Shift = () =>
  <span className={className}>
    {isMac ? '⇧' : 'Shift'}
  </span>;

export const Alt = () =>
  <span className={className}>
    {isMac ? '⌥' : 'Alt'}
  </span>;

export const Esc = () =>
  <span className={className}>
    {isMac ? '⎋' : 'Esc'}
  </span>;
