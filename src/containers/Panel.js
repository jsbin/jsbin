import { connect } from 'react-redux';
import { setSource } from '../actions/editor';
import { setCode } from '../actions/bin';
import { SET_HTML, SET_JS, SET_CSS } from '../actions/bin';
import * as MODES from '../lib/cm-modes';

import Panel from '../components/Panel';

const mapStateToProps = ({ bin = { html: '' }, editor }, ownProps) => {
  return { code: bin[ownProps.mode], ...editor, editor };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setSource: source => dispatch(setSource(source)),
    changeCode: code => {
      let type = SET_HTML;
      if (ownProps.mode === MODES.CSS) {
        type = SET_CSS;
      }
      if (ownProps.mode === MODES.JAVASCRIPT) {
        type = SET_JS;
      }

      dispatch(setCode(type, code));
    },
  };
};

const PanelContainer = connect(mapStateToProps, mapDispatchToProps)(Panel);

export default PanelContainer;
