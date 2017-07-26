import React from 'react';

export default function Version() {
  return (
    <span className="Version">
      v{process.env.REACT_APP_VERSION}
    </span>
  );
}
