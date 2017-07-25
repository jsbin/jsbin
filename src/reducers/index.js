import { combineReducers } from 'redux';

import bin from './bin';
import editor from './editor';
import session from './session';
import user from './user';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  user,
  session,
  editor,
  bin,
  router: routerReducer,
});
