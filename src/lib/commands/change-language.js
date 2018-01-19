import { setProcessor, triggerUpdate } from '../../actions/bin';
import { getAvailableProcessors } from '../../lib/processor';
import { JAVASCRIPT, CSS, HTML } from '../../lib/cm-modes';

const processors = {
  [JAVASCRIPT]: getAvailableProcessors(JAVASCRIPT),
  [CSS]: getAvailableProcessors(CSS),
  [HTML]: getAvailableProcessors(HTML),
};

export const changeLanguage = {
  title: 'Change language',
  condition: ({ app }) => processors[app.source].length > 1,
  run: (dispatch, { app }) => {
    return [
      ...processors[app.source].map(config => ({
        title: config.label,
        run: dispatch => {
          dispatch(setProcessor(app.source, config.name));
          dispatch(triggerUpdate());
        },
      })),
    ];
  },
};
