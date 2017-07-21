import { connect } from 'react-redux';
import CodeSettings from '../components/CodeSettings';
import { set, setSource, toggleOutput } from '../actions/editor';

const mapStateToProps = ({ editor }) => ({ ...editor });

const CodeSettingsContainer = connect(mapStateToProps, {
  set,
  setSource,
  toggleOutput
})(CodeSettings);

export default CodeSettingsContainer;
