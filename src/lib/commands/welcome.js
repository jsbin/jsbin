import { push } from 'react-router-redux';

export const welcome = {
  title: 'Help: Welcome',
  run: dispatch => dispatch(push('/welcome')),
};
