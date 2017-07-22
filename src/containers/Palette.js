import { connect } from 'react-redux';
import { dismiss } from '../actions/session';
import Palette from '../components/Palette';
import * as commands from '../lib/commands';

const mapDispatchToProps = dispatch => {
  return {
    dismiss: () => dispatch(dismiss()),
    run: command => commands[command].run(dispatch),
  };
};

const PaletteContainer = connect(null, mapDispatchToProps)(Palette);

export default PaletteContainer;
