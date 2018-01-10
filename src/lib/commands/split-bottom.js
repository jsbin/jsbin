import { toggleLayout } from '../../actions/app';

export const splitBottom = {
  condition: ({ app }) => app.splitColumns,
  title: 'Split to the bottom',
  run: dispatch => dispatch(toggleLayout(false)),
};
