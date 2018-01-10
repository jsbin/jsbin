import { changeResult, RESULT_PAGE } from '../../actions/session';

export const showPage = {
  title: 'Show page',
  run: dispatch => dispatch(changeResult(RESULT_PAGE)),
};
