import { connect } from 'react-redux';
import { setCode } from '../actions/bin';
import { SET_HTML, SET_JS, SET_CSS } from '../actions/code';
import * as MODES from '../lib/cm-modes';

import Panel from '../components/Panel';

const mapStateToProps = ({ bin, editor }, ownProps) => {
  return { code: bin[ownProps.mode], theme: editor.theme };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeCode: code => {
      let type = SET_HTML;
      if (ownProps.mode === MODES.CSS) {
        type = SET_CSS;
      }
      if (ownProps.mode === MODES.JAVASCRIPT) {
        type = SET_JS;
      }

      dispatch(setCode(type, code));
    }
  };
};

const PanelContainer = connect(mapStateToProps, mapDispatchToProps)(Panel);

export default PanelContainer;
