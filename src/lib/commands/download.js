import BinToHTML from '../../lib/BinToHTML';
import FileSaver from 'file-saver'; // @@ lazy load

export const download = {
  title: 'Download',
  run: (dispatch, { bin, processors }) => {
    const html = BinToHTML({
      html: processors['html-result'],
      javascript: processors['javascript-result'].code,
      css: processors['css-result'],
    });

    const blob = new Blob([html], { type: 'text/html' });
    FileSaver.saveAs(blob, (bin.id || 'jsbin') + '.html');
  },
};
