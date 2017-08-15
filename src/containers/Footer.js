import { connect } from 'react-redux';
import Footer from '../components/Footer';

const mapStateToProps = ({ session, user }) => ({
  error: session.error,
  username: user.username,
});

const FooterContainer = connect(mapStateToProps, null)(Footer);

export default FooterContainer;
