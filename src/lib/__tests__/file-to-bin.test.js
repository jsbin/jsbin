/* eslint-env jest */

import fileToBin from '../file-to-bin';
import fs from 'fs';

describe('file to bin', () => {
  const source = fs.readFileSync(
    __dirname + '/../../../fixtures/simple-from-github.html',
    'utf8'
  );

  test('from github', () => {
    const res = fileToBin(source);

    expect(res.html).not.toBe('');
    expect(res.html).not.toContain('<!--boot');
  });
});
