import { replace } from 'react-router-redux';
import { setId } from '../actions/bin';
import { setLocal } from '../lib/Api';

export async function save({ bin, app }, dispatch) {
  // console.log('defaultSave?', app.defaultSave);

  const res = await setLocal(bin);

  if (!bin.id) {
    const id = res.id;
    // assume we need to dispatch the change
    dispatch(replace(`/local/${id}${window.location.search}`));
    dispatch(setId(id));
  }
}
