import { connect } from 'react-redux';
import Welcome from '../components/Welcome';
import { updateShowWelcome } from '../actions/app';

const WelcomeContainer = connect(
  ({ app }) => ({ theme: app.theme, showWelcome: app.showWelcome }),
  { updateShowWelcome }
)(Welcome);

export default WelcomeContainer;
