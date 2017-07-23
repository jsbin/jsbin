import { connect } from 'react-redux';
import Footer from '../components/Footer';

const mapStateToProps = ({ session }) => ({
  error: session.error,
});

const FooterContainer = connect(mapStateToProps, null)(Footer);

export default FooterContainer;
