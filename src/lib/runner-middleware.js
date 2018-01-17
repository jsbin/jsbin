import { Child } from '../lib/runner-channel';

export default store => {
  const channel = new Child({
    dispatch: action => store.dispatch(action),
  });

  return next => action => {
    const result = next(action);

    const state = store.getState(); // new state after action was applied

    if (state.xxxx) {
      channel.dispatch(state.type, state.value);
      // then dispatch a channel event
    }

    return result;
  };
};
