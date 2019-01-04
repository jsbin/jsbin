import { connect } from 'react-redux';

import App from '../components/App';
import {
  fetchBin,
  fetchGist,
  fetchGithub,
  fetchLocal,
  fetchPost,
  fetchNew,
  setCode,
} from '../actions/bin';
import {
  triggerPalette,
  dismiss,
  setDirtyFlag,
  setCursor,
  setSplitterWidth,
} from '../actions/session';
import {
  dismissNotification,
  dismissAllNotifications,
} from '../actions/notifications';

import { setSource } from '../actions/app';

const mapStateToProps = ({
  user,
  bin,
  editor,
  session,
  app,
  notifications,
  processors,
}) => {
  return {
    notifications,
    bin,
    processors,
    editor,
    loading: bin.loading,
    session,
    splitterWidth: session.splitterWidth,
    splitColumns: app.splitColumns,
    result: session.result,
    theme: app.theme,
    user,
    showWelcome: app.showWelcome,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatchTo: (fn, args) => fn(dispatch, args),
    setCursor: (source, line, ch) => dispatch(setCursor(source, line, ch)),
    dismissNotification: id => dispatch(dismissNotification(id)),
    dismissAllNotifications: () => dispatch(dismissAllNotifications()),
    setCode: (code, panel) => dispatch(setCode(code, panel)),
    setDirtyFlag: value => dispatch(setDirtyFlag(value)),
    setSplitterWidth: pos => dispatch(setSplitterWidth(pos)),
    dismiss: () => dispatch(dismiss()),
    triggerPalette: value => dispatch(triggerPalette(value)),
    setSource: source => dispatch(setSource(source)),
    fetch: (params, user) => {
      if (params.bin) {
        if (params.bin.includes(':')) {
          const [owner, id] = params.bin.split(':');
          return dispatch(fetchGithub(user, owner, id, params.version));
        }

        return dispatch(fetchBin(params.bin, params.version));
      }

      if (params.gistId) {
        return dispatch(fetchGist(params.gistId));
      }

      if (params.postId) {
        return dispatch(fetchPost(params.postId));
      }

      if (params.localId) {
        return dispatch(fetchLocal(params.localId));
      }

      dispatch(fetchNew());
    },
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
