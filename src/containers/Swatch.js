import { connect } from 'react-redux';
import Swatch from '../components/Swatch';
import { toggleSwatch } from '../actions/session';

const SwatchContainer = connect(
  ({ session, app }) => ({
    swatchOpen: session.swatchOpen,
  }),
  { toggleSwatch }
)(Swatch);

export default SwatchContainer;
