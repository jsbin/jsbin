export const SET_OPTION = '@@editor/SET_OPTION';
export const MASS_UPDATE = '@@editor/MASS_UPDATE';

export function massUpdate(value) {
  return { type: MASS_UPDATE, value };
}

export function set(option, value) {
  return { type: SET_OPTION, option, value };
}
