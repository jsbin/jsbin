import { connect } from 'react-redux';
import App from '../components/App';
import { fetchBin, fetchDefault as loadDefault } from '../actions/bin';
import { setSource, toggleOutput } from '../actions/editor';

const mapStateToProps = ({ bin, editor, session }) => {
  return { bin, editor, loading: bin.loading, session };
};

const mapDispatchToProps = dispatch => {
  return {
    setSource: source => dispatch(setSource(source)),
    toggleOutput: value => dispatch(toggleOutput(value)),
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
