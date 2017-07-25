import { connect } from 'react-redux';
import CodeSettings from '../components/CodeSettings';
import { set } from '../actions/editor';
import { changeOutput, setSource } from '../actions/session';

const mapStateToProps = ({ editor, session }) => ({
  ...editor,
  source: session.source,
  output: session.output,
});

const CodeSettingsContainer = connect(mapStateToProps, {
  set,
  setSource,
  changeOutput,
})(CodeSettings);

export default CodeSettingsContainer;
