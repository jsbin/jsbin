import { combineReducers } from 'redux';

import app from './app';
import bin from './bin';
import editor from './editor';
import javascript from './javascript';
import notifications from './notifications';
import processors from './processors';
import { routerReducer } from 'react-router-redux';
import session from './session';
import share from './share';
import snippets from './snippets';
import user from './user';

export default combineReducers({
  app,
  bin,
  editor,
  javascript,
  notifications,
  processors,
  router: routerReducer,
  session,
  share,
  snippets,
  user,
});
