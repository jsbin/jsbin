import React from 'react';
import { Command, Shift, Backspace } from '../../components/Symbols';
import { DELETE } from '../../actions/bin';

export const del = {
  title: 'Delete',
  shortcut: (
    <kbd>
      <Command /> <Shift /> <Backspace />
    </kbd>
  ),
  run: dispatch => {
    alert('Not implemented yet');
    return;
    if (
      window.confirm('Are you sure you want to permanently delete this bin?')
    ) {
      dispatch({ type: DELETE });
    }
  },
};
