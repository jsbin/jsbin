import { connect } from 'react-redux';
import Logout from '../components/Logout';
import { setToken } from '../actions/user';
import { push } from 'react-router-redux';
import { RESET } from '../actions/bin';

const LogoutContainer = connect(null, dispatch => {
  return {
    logout: () => {
      dispatch(setToken(null));
      dispatch(push('/', { action: { type: RESET } }));
    },
  };
})(Logout);

export default LogoutContainer;
