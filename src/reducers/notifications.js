import {
  ADD_NOTIFICATION,
  DISMISS_NOTIFICATION,
  DISMISS_ALL_NOTIFICATIONS,
} from '../actions/notifications';

let guid = 0;

export const defaultState = [];

export default function reducer(state = defaultState, action) {
  const { type } = action;

  if (type === ADD_NOTIFICATION) {
    guid++;
    const key = guid;
    return [
      ...state,
      {
        message: action.value,
        key,
        dismissAfter: false,
        ...action.props,
      },
    ];
  }

  if (type === DISMISS_ALL_NOTIFICATIONS) {
    return [];
  }

  if (type === DISMISS_NOTIFICATION) {
    return [...state.filter(n => n.key !== action.value)];
  }

  return state;
}
