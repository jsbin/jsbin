import { connect } from 'react-redux';
import Login from '../components/Login';

const LoginContainer = connect(({ user }) => ({ user }), null)(Login);

export default LoginContainer;
