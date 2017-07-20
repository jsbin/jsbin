export const SET_JS = 'SET_JS';
export const SET_HTML = 'SET_HTML';
export const SET_CSS = 'SET_CSS';
export const SET_OUTPUT = 'SET_OUTPUT';

export function setCode(type, code) {
  return {
    type,
    code
  };
}
