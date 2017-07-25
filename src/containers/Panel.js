import { connect } from 'react-redux';
import { setCode, save } from '../actions/bin';
import { setSource, setCursor } from '../actions/session';
import { SET_HTML, SET_JS, SET_CSS } from '../actions/bin';
import * as MODES from '../lib/cm-modes';

import Panel from '../components/Panel';

const mapStateToProps = ({ bin = { html: '' }, editor, session }, ownProps) => {
  return { code: bin[session.source], editor, session, source: session.source };
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
