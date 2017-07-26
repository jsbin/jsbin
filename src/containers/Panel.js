import { connect } from 'react-redux';
import { setCode, save } from '../actions/bin';
import { setCursor } from '../actions/session';
import { SET_HTML, SET_JS, SET_CSS } from '../actions/bin';
import { setSource } from '../actions/app';
import * as MODES from '../lib/cm-modes';

import Panel from '../components/Panel';

const mapStateToProps = ({ bin = { html: '' }, editor, session, app }) => {
  return { code: bin[app.source], editor, session, source: app.source };
};

const mapDispatchToProps = dispatch => {
  return {
    setCursor: ({ line, ch, source }) => {
      dispatch(setCursor(source, line, ch));
    },
    save: () => dispatch(save()),
    setSource: source => dispatch(setSource(source)),
    changeCode: (code, source) => {
      let type = SET_HTML;
      if (source === MODES.CSS) {
        type = SET_CSS;
      }
      if (source === MODES.JAVASCRIPT) {
        type = SET_JS;
      }

      dispatch(setCode(code, type));
    },
  };
};

const PanelContainer = connect(mapStateToProps, mapDispatchToProps)(Panel);

export default PanelContainer;
