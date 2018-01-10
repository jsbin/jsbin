import React from 'react';
import { Command } from '../../components/Symbols';
import { SAVE } from '../../actions/bin';

export const save = {
  title: 'Save',
  shortcut: (
    <kbd>
      <Command /> S
    </kbd>
  ),
  run: dispatch => {
    dispatch({ type: SAVE });
  },
};
