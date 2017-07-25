import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
import * as bin from '../lib/Defaults';
import { fetchDefault } from '../actions/bin';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App loadDefault={fetchDefault} bin={bin} />, div);
});
