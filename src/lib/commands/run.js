import React from 'react';
import { Shift, Enter } from '../../components/Symbols';
import { update } from '../../actions/processors';

export const run = {
  title: 'Run bin',
  shortcut: (
    <kbd>
      <Shift /> <Enter />
    </kbd>
  ),
  run: dispatch => dispatch(update()),
};
