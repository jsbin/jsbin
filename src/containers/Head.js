import { connect } from 'react-redux';
import Head from '../components/Head';

const HeadContainer = connect(
  ({ session }) => ({ error: !!session.error }),
  null
)(Head);

export default HeadContainer;
