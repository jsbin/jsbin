import React from 'react';
import Layout from '../containers/PageLayout';

import '../css/Login.css';

const Login = () => (
      <Layout>
        <div className="Login">
          <div>
            <a
              href={`${process.env.REACT_APP_API}/auth`}
              className="Button pretty login-btn"
            >
              Sign in using Github
            </a>

            <p><strong>Important: </strong>you will be giving access to read and write on your repos. JS Bin will <em>only</em> create a single repository called "bins" and you will be able to save all your bins there.</p>
            <p>If you don't trust JS Bin with this access, please don't click the link above. All your bins will can be saved locally, downloaded and even shared online using other services.</p>

            <h2>Why sign in?</h2>
            <ul>
              <li>Share editable URLs and published bins</li>
              <li>Export to Github and embed in your website</li>
              <li>Create privately shareable bins</li>
              <li>Sync your settings</li>
            </ul>
          </div>
        </div>
      </Layout>
    );


export default Login;
