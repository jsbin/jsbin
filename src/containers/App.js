import { connect } from 'react-redux';
import App from '../components/App';

const mapStateToProps = ({ bin, editor }) => ({ bin, editor });

const AppContainer = connect(mapStateToProps, null)(App);

export default AppContainer;
