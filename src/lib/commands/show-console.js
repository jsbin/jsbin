import { changeResult, RESULT_CONSOLE } from '../../actions/session';

export const showConsole = {
  title: 'Show console',
  run: dispatch => dispatch(changeResult(RESULT_CONSOLE)),
};
