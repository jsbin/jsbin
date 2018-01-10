import { toggleResult } from '../../actions/session';

export const togglePageResult = {
  title: 'Toggle result',
  run: dispatch => {
    dispatch(toggleResult());
  },
};
