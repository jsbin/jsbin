export const SET_OPTION = '@@editor/SET_OPTION';

export function set(option, value) {
  return { type: SET_OPTION, option, value };
}
