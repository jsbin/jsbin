import { combineReducers } from 'redux';

import bin from './bin';
import editor from './editor';
import session from './session';
import user from './user';
import app from './app';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  user,
  app,
  session,
  editor,
  bin,
  router: routerReducer,
});
