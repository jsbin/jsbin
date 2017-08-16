import { connect } from 'react-redux';
import Result from '../components/Result';
import { clearError, setError } from '../actions/session';

const ResultContainer = connect(
  ({ bin, session, app }) => ({
    code: bin.result,
    source: app.source,
    binLoading: bin.loading,
    bin,
    error: session.error,
    splitColumns: app.splitColumns,
  }),
  { clearError, setError }
)(Result);

export default ResultContainer;
