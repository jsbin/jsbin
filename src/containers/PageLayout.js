import { connect } from 'react-redux';
import PageLayout from '../components/PageLayout';

const PageLayoutContainer = connect(({ app }) => ({ theme: app.theme }), null)(
  PageLayout
);

export default PageLayoutContainer;
