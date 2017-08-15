import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../containers/PageLayout';
import Head from '../components/Head';
import Error from '../components/GenericErrorPage';

import License from './Account/License';
import Delete from './Account/Delete';
import Invoice from './Account/Invoice';

import '../css/Account.css';

const subPages = {
  delete: Delete,
  license: License,
  invoice: Invoice,
};

export default class Account extends Component {
  render() {
    const { user } = this.props;
    const subPage = this.props.match.params.subPage;

    const count = 20;

    if (subPage) {
      if (!subPages[subPage]) {
        return (
          <Error
            status={404}
            message={`Failed to find the "${subPage}" requested.`}
          />
        );
      }

      const Page = subPages[subPage];
      return <Page {...this.props} />;
    }

    return (
      <Layout className="Account">
        <Head title="Account" />
        <h1>
          @{user.username}{' '}
        </h1>
        <ul>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
          <li>
            <Link to="/account/license">License</Link>
          </li>
          <li>
            <a href="/account/clear-all">
              Clear all local bins ({count})
            </a>
          </li>
          <li>
            <a href="/logout">Logout</a>
          </li>
          <li>
            <Link to="/account/delete">Delete account</Link>
          </li>
        </ul>
      </Layout>
    );
  }
}
