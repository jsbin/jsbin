import React from 'react';
import { Command, Shift } from '../../components/Symbols';

export const settings = {
  title: 'Settings',
  shortcut: (
    <kbd>
      <Command /> <Shift />
      {' ,'}
    </kbd>
  ),
  run: () => {
    // dispatch => dispatch(push('/settings')),
    window.open('/settings');
    return null;
  },
};
