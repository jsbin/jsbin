import { connect } from 'react-redux';
import Result from '../components/Result';
import { clearError, setError } from '../actions/session';
import { JAVASCRIPT, HTML } from '../lib/cm-modes';

const ResultContainer = connect(
  ({ bin, session, app, processors }) => ({
    result: processors.result,
    insertJS: processors.insertJS,
    javascript: processors[`${JAVASCRIPT}-result`],
    html: processors[`${HTML}-result`],
    error: session.error,
    splitColumns: app.splitColumns,
  }),
  { clearError, setError }
)(Result);

export default ResultContainer;
