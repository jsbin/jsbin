/* global window */
import { applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import thunkMiddleware from 'redux-thunk';

export default function createMiddleware(middleware = []) {
  middleware.push(applyMiddleware(thunkMiddleware));
  middleware.push(applyMiddleware(reduxPromise));

  if (process.browser && window.devToolsExtension) {
    middleware.push(window.devToolsExtension());
  }

  return middleware;
}
