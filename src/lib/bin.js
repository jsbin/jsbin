import idb from 'idb-keyval';
import { push } from 'react-router-redux';
import uuid from './uuid';
import { setError } from '../actions/session';
import { setId } from '../actions/bin';

export function save({ bin }, dispatch) {
  const { html, javascript, css } = bin;
  const id = bin.id || uuid();

  return idb
    .set(id, { html, javascript, css, id })
    .catch(e => {
      console.log(e);
      dispatch(setError(e.message));
    })
    .then(() => {
      dispatch(push(`/local/${id}${window.location.search}`));
      dispatch(setId(id));
    });
}
