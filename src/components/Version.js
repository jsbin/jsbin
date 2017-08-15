import React from 'react';

export default function Version() {
  return (
    <span>
      v{process.env.REACT_APP_VERSION}
    </span>
  );
}
