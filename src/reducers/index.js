import { combineReducers } from 'redux';
import bin from './bin';
import editor from './editor';

export default combineReducers({
  editor,
  bin
});
