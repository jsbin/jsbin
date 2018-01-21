import BinToHTML from 'bin-to-file';
import { convertToStandardBin } from '../Api';
import FileSaver from 'file-saver'; // @@ lazy load

export const download = {
  title: 'Download',
  run: (dispatch, { bin, processors }) => {
    const res = convertToStandardBin({ bin, processors });
    const html = BinToHTML(res);
    const blob = new Blob([html], { type: 'text/html' });
    FileSaver.saveAs(blob, (bin.id || 'jsbin') + '.html');
  },
};
