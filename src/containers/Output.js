import { connect } from 'react-redux';
import Output from '../components/Output';
import { clearError, setError } from '../actions/session';

const OutputContainer = connect(
  ({ bin, session }) => ({ code: bin.output, bin, error: session.error }),
  { clearError, setError }
)(Output);

export default OutputContainer;
