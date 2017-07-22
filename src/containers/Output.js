import { connect } from 'react-redux';
import Output from '../components/Output';

const OutputContainer = connect(({ bin }) => ({ bin }), null)(Output);

export default OutputContainer;
