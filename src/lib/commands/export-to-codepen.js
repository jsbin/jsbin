export const exportToCodePen = {
  title: 'Export to CodePen',
  run: async (dispatch, { bin, user }) => {
    // if (!user.pro) {
    //   return {
    //     title: 'JS Bin license required, upgrade?',
    //     run: dispatch => {
    //       dispatch(push('/upgrade'));
    //     },
    //   };
    // }

    const exporter = await import(/* webpackChunkName: "exporter" */ '../../lib/exporter');

    exporter.codepen(bin);
  },
};
