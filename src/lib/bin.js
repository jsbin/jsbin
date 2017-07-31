import idb from 'idb-keyval';
import { replace } from 'react-router-redux';
import uuid from './uuid';
import { setError } from '../actions/session';
import { setId } from '../actions/bin';

export function save({ bin }, dispatch) {
  const { html, javascript, css } = bin;
  const id = bin.id || uuid();

  return idb
    .set(id, { html, javascript, css, id })
    .then(() => {
      dispatch(replace(`/local/${id}${window.location.search}`));
      dispatch(setId(id));
    })
    .catch(e => {
      console.log(e);
      dispatch(setError(e.message));
    });
}
