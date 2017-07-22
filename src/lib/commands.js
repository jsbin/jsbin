import { push } from 'react-router-redux';

export const save = {
  title: 'Save',
  shortcut: null,
  run: dispatch => {
    console.log('not implemented');
    dispatch({ type: '@@bin/save' });
  },
};

export const open = {
  title: 'Open...',
  run: dispatch => {
    console.log('not implemented');
    dispatch(push('/open'));
  },
};

export const newbin = {
  title: 'New',
  run: dispatch => {
    dispatch(push('/'));
  },
};
