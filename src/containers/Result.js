import { connect } from 'react-redux';
import Result from '../components/Result';
import { clearError, setError } from '../actions/session';
import { JAVASCRIPT, HTML } from '../lib/cm-modes';

const ResultContainer = connect(
  ({ bin, session, app, processors }) => ({
    // stateToProps
    renderResult: session.result,
    result: processors.result,
    updated: processors.updated,
    insertJS: processors.insertJS,
    javascript: processors[`${JAVASCRIPT}-result`],
    html: processors[`${HTML}-result`],
    error: session.error,
    splitColumns: app.splitColumns,
    theme: app.theme,
  }),
  { clearError, setError } // propsToDispatch
)(Result);

export default ResultContainer;
