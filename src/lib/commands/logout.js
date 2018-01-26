import { push } from 'react-router-redux';
import { setToken } from '../../actions/user';
import { addNotification } from '../../actions/notifications';
import { RESET } from '../../actions/bin';

export const logout = {
  title: 'Logout',
  condition: ({ user }) => !!user.token,
  run: dispatch => {
    dispatch(setToken(null));
    dispatch(push('/', { action: { type: RESET } }));
    dispatch(
      addNotification(`You're now logged out 👋`, { dismissAfter: 2 * 1000 })
    );
  },
};
