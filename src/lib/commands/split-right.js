import { toggleLayout } from '../../actions/app';

export const splitRight = {
  condition: ({ app }) => !app.splitColumns,
  title: 'Split to the right',
  run: dispatch => dispatch(toggleLayout(true)),
};
