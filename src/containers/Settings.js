import { connect } from 'react-redux';
import Settings from '../components/Settings';

const SettingsContainer = connect(({ editor }) => ({ editor }), null)(Settings);

export default SettingsContainer;
