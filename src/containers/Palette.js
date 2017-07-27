import { connect } from 'react-redux';
import { dismiss } from '../actions/session';
import Palette from '../components/Palette';

const mapDispatchToProps = dispatch => {
  return {
    dismiss: () => dispatch(dismiss()),
    run: (command, state = {}) => command.run(dispatch, state),
  };
};

const PaletteContainer = connect(({ bin }) => ({ bin }), mapDispatchToProps)(
  Palette
);

export default PaletteContainer;
