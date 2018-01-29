import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

const STATIC = process.env.REACT_APP_STATIC;

/* <link rel="icon" type="image/png" sizes="32x32" href="%PUBLIC_URL%/favicon-32x32.png?v=YAoG8Nr9v0">
<link rel="icon" type="image/png" sizes="16x16" href="%PUBLIC_URL%/favicon-16x16.png?v=YAoG8Nr9v0">
<link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico?v=YAoG8Nr9v0"> */

const Head = ({ children, title = 'JS Bin', error = false }) =>
  <Helmet>
    <meta charSet="utf-8" />
    <title>
      {title}
    </title>
    <link
      rel="icon shortcut"
      type="image/svg+xml"
      href={`${STATIC}/images/favicon.svg`}
    />
    <link
      rel="shortcut icon"
      href={`${STATIC}/images/favicon${error ? '-err' : ''}.png`}
    />
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
