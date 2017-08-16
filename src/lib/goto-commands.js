import { HTML, JAVASCRIPT, CSS } from '../lib/cm-modes';
import { setSource } from '../actions/app';
import { setCursor } from '../actions/session';

function gotoPanelAndCursor(dispatch, source, filter) {
  dispatch(setSource(source));
  if (filter.substr(1).includes(':')) {
    const [_, line] = filter.substr(1).split(':');
    dispatch(setCursor(source, parseInt(line.trim(), 0) - 1, 0));
  }
}

export const html = {
  title: ':html',
  display: 'Goto HTML',
  run: (dispatch, { filter }) => {
    gotoPanelAndCursor(dispatch, HTML, filter);
  },
};

export const css = {
  title: ':css',
  display: 'Goto CSS',
  run: (dispatch, { filter }) => {
    gotoPanelAndCursor(dispatch, CSS, filter);
  },
};

export const javascript = {
  title: ':javascript',
  display: 'Goto JavaScript',
  run: (dispatch, { filter }) => {
    gotoPanelAndCursor(dispatch, JAVASCRIPT, filter);
  },
};

export const line = {
  title: ':1',
  meta: '123456789',
  display: 'Goto line…',
  run: (dispatch, { app, filter }) => {
    dispatch(setCursor(app.source, parseInt(filter.slice(1), 0) - 1, 0));
  },
};
