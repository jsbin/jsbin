import React from 'react';
import { Command, Enter } from '../../components/Symbols';
import { update } from '../../actions/processors';

export const run = {
  title: 'Run bin',
  shortcut: (
    <kbd>
      <Command /> <Enter />
    </kbd>
  ),
  run: dispatch => dispatch(update()),
};
