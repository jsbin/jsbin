import React from 'react';

import { Command, Shift } from './Symbols';
import '../css/Footer.css';

const Footer = () =>
  <footer className="Footer">
    <ul>
      <li>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://help.jsbin.com"
        >
          Documentation
        </a>
      </li>
      <li>
        Show all commands <Command /> <Shift /> P
      </li>
    </ul>
  </footer>;

export default Footer;
