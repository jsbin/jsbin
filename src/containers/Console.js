import { connect } from 'react-redux';
import Console from '../components/Console';

const ConsoleContainer = connect(({ bin }) => ({ bin }), null)(Console);

export default ConsoleContainer;
