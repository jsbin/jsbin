export const SET_JS = 'SET_JS';
export const SET_HTML = 'SET_HTML';
export const SET_CSS = 'SET_CSS';
export const SET_OUTPUT = 'SET_OUTPUT';

export function setCode(type, code) {
  return async (dispatch, getState) => {
    const allCode = getState().code;

    dispatch({
      type,
      code
    });

    // combine
    return new Promise(resolve => {
      const output = code;
      resolve(
        dispatch({
          type: SET_OUTPUT,
          code: output
        })
      );
    });
  };
}
