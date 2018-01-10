import { push } from 'react-router-redux';

export const account = {
  title: 'Account',
  condition: ({ user }) => !!user.username,
  run: dispatch => {
    dispatch(push('/account'));
  },
};
