import { combineReducers } from 'redux';

import bin from './bin';
import editor from './editor';
import { routerReducer } from 'react-router-redux';

export default combineReducers({
  editor,
  bin,
  router: routerReducer
});
