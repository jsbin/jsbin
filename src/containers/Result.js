import { connect } from 'react-redux';
import Result from '../components/Result';
import {
  clearError,
  setError,
  setPreview,
  clearPreviews,
} from '../actions/session';
import { JAVASCRIPT, HTML, CSS } from '../lib/cm-modes';

const ResultContainer = connect(
  ({ bin, session, app, processors }) => ({
    // stateToProps
    renderResult: session.result,
    result: processors.result,
    updated: processors.updated,
    insertJS: processors.insertJS,
    javascript: processors[`${JAVASCRIPT}-result`],
    html: processors[`${HTML}-result`],
    css: processors[`${CSS}-result`],
    error: session.error,
    splitColumns: app.splitColumns,
    theme: app.theme,
    bin: bin || {},
  }),
  {
    clearError,
    setError,
    setPreview,
    clearPreviews,
  } // propsToDispatch
)(Result);

export default ResultContainer;
