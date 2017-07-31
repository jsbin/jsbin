import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import App from '../components/App';
import {
  fetchBin,
  fetchGithub,
  fetchLocal,
  fetchDefault as loadDefault,
  setBin,
  setCode,
} from '../actions/bin';
import {
  triggerPalette,
  dismiss,
  setDirtyFlag,
  setCursor,
  setSplitterWidth,
} from '../actions/session';

import { setSource } from '../actions/app';

const mapStateToProps = ({ bin, editor, session, app }) => {
  return {
    bin,
    editor,
    loading: bin.loading,
    session,
    splitterWidth: session.splitterWidth,
    splitColumns: app.splitColumns,
    output: session.output,
    theme: app.theme,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCursor: (source, line, ch) => dispatch(setCursor(source, line, ch)),
    setCode: (code, panel) => dispatch(setCode(code, panel)),
    setDirtyFlag: value => dispatch(setDirtyFlag(value)),
    setSplitterWidth: pos => dispatch(setSplitterWidth(pos)),
    dismiss: () => dispatch(dismiss()),
    setBin: bin => dispatch(setBin(bin)),
    triggerPalette: value => dispatch(triggerPalette(value)),
    setSource: source => dispatch(setSource(source)),
    fetch: params => {
      if (params.bin) {
        return dispatch(fetchBin(params.bin, params.version));
      }

      if (params.gistId) {
        return dispatch(fetchGithub(params.gistId));
      }

      if (params.localId) {
        return dispatch(fetchLocal(params.localId));
      }

      dispatch(loadDefault());
    },
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(
  withRouter(App)
);

export default AppContainer;
