import { push } from 'react-router-redux';
import { RESET } from '../actions/bin';

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
    // dispatch(push('/open'));
  },
};

export const newbin = {
  title: 'New',
  run: dispatch => {
    dispatch(push('/', { action: { type: RESET } }));
  },
};

/**
 * Wanted commands:
 *
 * save as template (optionally named)
 * new from template
 * upgrade
 * clone
 * export
 * delete
 * make private
 * add library + search
 * download
 * toggle dark/light theme
 * help / search
 */
