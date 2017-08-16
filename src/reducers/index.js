import { combineReducers } from 'redux';

import bin from './bin';
import processors from './processors';
import editor from './editor';
import session from './session';
import user from './user';
import app from './app';
import javascript from './javascript';
import share from './share';
import snippets from './snippets';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  user,
  share,
  snippets,
  javascript,
  app,
  session,
  editor,
  bin,
  processors,
  router: routerReducer,
});
