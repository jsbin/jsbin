import { connect } from 'react-redux';
import CodeSettings from '../components/CodeSettings';
import { toggleLayout, setSource } from '../actions/app';
import { set } from '../actions/editor';
import { changeResult } from '../actions/session';

const mapStateToProps = ({ editor, session, app, bin }) => ({
  lineNumbers: editor.lineNumbers,
  lineWrapping: editor.lineWrapping,
  source: app.source,
  result: session.result,
  splitColumns: app.splitColumns,
  bin,
});

const CodeSettingsContainer = connect(mapStateToProps, {
  set,
  toggleLayout,
  setSource,
  changeResult,
})(CodeSettings);

export default CodeSettingsContainer;
