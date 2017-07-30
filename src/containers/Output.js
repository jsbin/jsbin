import { connect } from 'react-redux';
import Output from '../components/Output';
import { clearError, setError } from '../actions/session';

const OutputContainer = connect(
  ({ bin, session, app }) => ({
    code: bin.output,
    bin,
    error: session.error,
    splitColumns: app.splitColumns,
  }),
  { clearError, setError }
)(Output);

export default OutputContainer;
