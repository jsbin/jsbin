import Cookies from 'js-cookie';

export const eject = {
  title: 'Revert to (old) JS Bin',
  run: () => {
    Cookies.remove('version');
    window.location.reload();
  },
};
