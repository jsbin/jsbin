import React from 'react';
import PropTypes from 'prop-types';
import * as Keys from './Symbols';

const ucFirst = n => n[0].toUpperCase() + n.slice(1);

const ShortcutKeys = ({ shortcut }) => {
  // keys: 'command+shift+,';

  const children = shortcut.split('+').map(_ => _.trim()).map((key, i) => {
    const ucKey = ucFirst(key);
    if (Keys[ucKey]) {
      return (
        <span key={i}>
          {Keys[ucKey]()}
        </span>
      );
    }

    return (
      <span key={i}>
        {key}
      </span>
    );
  });

  return (
    <kbd>
      {children}
    </kbd>
  );
};

ShortcutKeys.propTypes = {
  shortcut: PropTypes.string.isRequired,
};

export default ShortcutKeys;
