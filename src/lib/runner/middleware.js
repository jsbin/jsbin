import { Child } from './channel';
import { SET_JS, SET_HTML, SET_RESULT } from '../../actions/processors';
import { CHANGE_RESULT } from '../../actions/session';
import { TOGGLE_LAYOUT, SET_THEME } from '../../actions/app';
import { SET_ERROR, CLEAR_ERROR } from '../../actions/session';

export default store => {
  const channel = new Child({
    dispatch: action => store.dispatch(action),
    initState: state => {
      const {
        html,
        result,
        insertJS,
        javascript,
        splitColumns,
        renderResult,
        theme,
      } = state;
      store.dispatch({ type: SET_JS, value: javascript });
      store.dispatch({ type: SET_HTML, value: html });
      store.dispatch({ type: SET_RESULT, result, insertJS });
      store.dispatch({ type: SET_THEME, value: theme });
      store.dispatch({ type: TOGGLE_LAYOUT, value: splitColumns });
      store.dispatch({ type: CHANGE_RESULT, value: renderResult });
    },
  });

  return next => action => {
    const result = next(action);

    if ([SET_ERROR, CLEAR_ERROR].includes(action.type)) {
      channel.dispatch(action);
    }

    return result;
  };
};
