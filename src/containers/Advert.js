import { connect } from 'react-redux';
import Advert from '../components/Advert';

const AdvertContainer = connect(({ user }) => ({ user }), null)(Advert);

export default AdvertContainer;
