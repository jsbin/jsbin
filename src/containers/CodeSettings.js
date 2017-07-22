import { connect } from 'react-redux';
import CodeSettings from '../components/CodeSettings';
import { set, setSource } from '../actions/editor';
import { changeOutput } from '../actions/session';

const mapStateToProps = ({ editor, session }) => ({
  ...editor,
  output: session.output,
});

const CodeSettingsContainer = connect(mapStateToProps, {
  set,
  setSource,
  changeOutput,
})(CodeSettings);

export default CodeSettingsContainer;
