import { connect } from 'react-redux';
import CodeSettings from '../components/CodeSettings';
import { toggleLayout, setSource } from '../actions/app';
import { set } from '../actions/editor';
import { changeOutput } from '../actions/session';

const mapStateToProps = ({ editor, session, app }) => ({
  lineNumbers: editor.lineNumbers,
  lineWrapping: editor.lineWrapping,
  source: app.source,
  output: session.output,
  splitColumns: app.splitColumns,
});

const CodeSettingsContainer = connect(mapStateToProps, {
  set,
  toggleLayout,
  setSource,
  changeOutput,
})(CodeSettings);

export default CodeSettingsContainer;
