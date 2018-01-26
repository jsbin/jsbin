import React from 'react';
import Loading from './Loading';

export default ({ logout }) => {
  logout(null);
  return <Loading />;
};
