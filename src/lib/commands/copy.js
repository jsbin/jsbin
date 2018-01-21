import copy from 'copy-to-clipboard';
import BinToHTML from 'bin-to-file';
import { addNotification } from '../../actions/notifications';

const copyOk = dispatch => {
  return dispatch(addNotification('Copied 👍', { dismissAfter: 5 * 1000 }));
};

export const copyToClip = {
  title: 'Copy to clipboard',
  run: (dispatch, { bin, app }) => {
    copy(bin[app.source]);
    copyOk(dispatch);
  },
};

export const copyTransformed = {
  title: 'Copy compiled to clipboard',
  condition: ({ bin, app }) => {
    return bin[app.source + '-processor'] !== app.source;
  },
  run: (dispatch, { bin, app, processors }) => {
    copy(processors[app.source + '-result']);
    copyOk(dispatch);
  },
};

export const copyAll = {
  title: 'Copy page result to clipboard',
  run: (dispatch, { processors }) => {
    const html = BinToHTML({
      html: processors['html-result'],
      javascript: processors['javascript-result'],
      css: processors['css-result'],
    });
    copy(html);
    copyOk(dispatch);
  },
};
