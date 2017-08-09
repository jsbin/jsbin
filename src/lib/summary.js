import * as defaults from './Defaults';

/**
 * Generates a simple summary line based on the body of the bin, either the
 * HTML or the JS + CSS panel content, stripping away common templates and
 * reducing to a single summary line.
 * @param {Object} bin - A JS Bin object
 * @param {string} bin.html - HTML which is first tested
 * @param {string} bin.javascript - JavaScript is then striped of defaults
 * @param {string} bin.css - CSS is the final check
 * @returns {String} Text summary of the bin limited to 100 characters
 */
export default function summary(bin = {}) {
  let content = '';

  if (!bin.html.toLowerCase().includes('<body')) {
    return bin.html.replace(/\n/g, ' ').trim();
  }

  const html = (bin.html.split(/(<body>|<\/body>)/gi)[2] || '')
    .replace(/\n/g, ' ')
    .trim();

  if (!html) {
    content = bin.javascript
      .replace(defaults.javascript, '')
      .replace(/\n/g, ' ')
      .trim();

    if (!content) {
      content = bin.css.replace(defaults.css, '').replace(/\n/g, ' ').trim();
    }
  } else {
    content = html;
  }

  if (content.length > 100) {
    content = content.substr(0, 99) + '…';
  }

  return content;
}
