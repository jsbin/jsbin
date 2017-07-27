import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const STATIC = process.env.REACT_APP_STATIC;

const Head = ({ children }) =>
  <Helmet>
    <meta charSet="utf-8" />
    <title>JS Bin</title>
    <link
      rel="icon shortcut"
      type="image/svg+xml"
      href={`${STATIC}/images/favicon.svg`}
    />
    <link rel="shortcut icon" href={`${STATIC}/images/favicon.png`} />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <link rel="canonical" href="https://jsbin.com" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    {children}
  </Helmet>;

export default Head;

Head.propTypes = {
  children: PropTypes.node,
};
