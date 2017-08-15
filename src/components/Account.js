import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../containers/PageLayout';

import '../css/Account.css';

export default ({ user }) => {
  const count = 20;
  return (
    <PageLayout className="Account">
      <h1>
        @{user.username}{' '}
      </h1>
      <ul>
        <li>
          <Link to="/settings">Settings</Link>
        </li>
        <li>
          <a href="/account/clear-all">
            Clear all local bins ({count})
          </a>
        </li>
        <li>
          <a href="/logout">Logout</a>
        </li>
      </ul>
    </PageLayout>
  );
};
