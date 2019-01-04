import { changeResult, RESULT_BOTH } from '../../actions/session';

export const showBoth = {
  title: 'Show both page & console',
  run: dispatch => dispatch(changeResult(RESULT_BOTH)),
};
