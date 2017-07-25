import { connect } from 'react-redux';
import App from '../components/App';
import {
  fetchBin,
  fetchDefault as loadDefault,
  setBin,
  setCode,
} from '../actions/bin';
import {
  triggerPalette,
  dismiss,
  setDirtyFlag,
  setCursor,
  setSource,
  setSplitterWidth,
} from '../actions/session';

const mapStateToProps = ({ bin, editor, session, app }) => {
  return {
    bin,
    editor,
    loading: bin.loading,
    session,
    splitterWidth: session.splitterWidth,
    vertical: app.vertical,
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
    loadDefault: () => dispatch(loadDefault()),
    fetch: ({ bin, version }) => {
      dispatch(fetchBin(bin, version))
        .then(res => {
          window.document.title = `JS Bin: ${res.url}@${res.snapshot}`;
        })
        .catch(e => console.log('failed', e));
    },
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
