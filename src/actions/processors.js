export const RESET = '@@processors/RESET';
export const SET_RESULT = '@@processor/set/RESULT';
export const SET_JS = '@@processor/set/JAVASCRIPT';
export const SET_HTML = '@@processor/set/HTML';
export const SET_CSS = '@@processor/set/CSS';
export const UPDATE = '@@processor/UPDATE';

export function update() {
  return { type: UPDATE };
}

export function reset() {
  return { type: RESET };
}
