import { connect } from 'react-redux';
import Account from '../components/Account';

const AccountContainer = connect(({ user }) => ({ user }), null)(Account);

export default AccountContainer;
