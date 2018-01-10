import { push } from 'react-router-redux';
import { RESET } from '../../actions/bin';

export const newBin = {
  title: 'New',
  run: dispatch => {
    dispatch(push('/', { action: { type: RESET } }));
  },
};
