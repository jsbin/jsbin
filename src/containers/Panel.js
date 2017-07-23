import { connect } from 'react-redux';
import { setSource } from '../actions/editor';
import { setCode, save } from '../actions/bin';
import { setCursor } from '../actions/session';
import { SET_HTML, SET_JS, SET_CSS } from '../actions/bin';
import * as MODES from '../lib/cm-modes';

import Panel from '../components/Panel';

const mapStateToProps = ({ bin = { html: '' }, editor, session }, ownProps) => {
  return { code: bin[editor.source], ...editor, editor, session };
};

const mapDispatchToProps = dispatch => {
  return {
    setCursor: ({ line, ch, source }) => {
      dispatch(setCursor(source, line, ch));
    },
    save: () => dispatch(save()),
    setSource: source => dispatch(setSource(source)),
    changeCode: (source, code) => {
      let type = SET_HTML;
      if (source === MODES.CSS) {
        type = SET_CSS;
      }
      if (source === MODES.JAVASCRIPT) {
        type = SET_JS;
      }

      dispatch(setCode(type, code));
    },
  };
};

const PanelContainer = connect(mapStateToProps, mapDispatchToProps)(Panel);

export default PanelContainer;
