import { connect } from 'react-redux';
import Mirror from '../components/Mirror';
import { setCursor, setDirtyFlag } from '../actions/session';

const MirrorContainer = connect(
  ({ editor, session }) => ({ editor, session }),
  { setCursor, setDirtyFlag }
)(Mirror);

export default MirrorContainer;
