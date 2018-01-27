import { push } from 'react-router-redux';
import { reset } from '../../actions/bin';

export const newBin = {
  title: 'New',
  run: dispatch => {
    dispatch(push('/', { action: reset() }));
  },
};
