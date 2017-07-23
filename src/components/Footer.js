import React from 'react';

import { Command, Shift } from './Symbols';
import '../css/Footer.css';

const Footer = () =>
  <footer className="Footer">
    <center>
      Show all commands <Command /> <Shift /> P
    </center>
  </footer>;

export default Footer;
