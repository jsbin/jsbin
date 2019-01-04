import { update } from '../../actions/processors';

export const run = {
  title: 'Run bin',
  shortcut: 'shift+enter',
  run: dispatch => dispatch(update()),
};
