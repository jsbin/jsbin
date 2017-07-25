import { connect } from 'react-redux';
import CodeSettings from '../components/CodeSettings';
import { toggleLayout } from '../actions/app';
import { set } from '../actions/editor';
import { changeOutput, setSource } from '../actions/session';

const mapStateToProps = ({ editor, session, app }) => ({
  ...editor,
  source: session.source,
  output: session.output,
  vertical: app.vertical,
});

const CodeSettingsContainer = connect(mapStateToProps, {
  set,
  toggleLayout,
  setSource,
  changeOutput,
})(CodeSettings);

export default CodeSettingsContainer;
