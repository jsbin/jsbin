import { combineReducers } from 'redux';

import bin from './bin';
import editor from './editor';
import session from './session';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  session,
  editor,
  bin,
  router: routerReducer,
});
