import React from 'react';
import { replace } from 'react-router-redux';
import { addNotification } from '../../actions/notifications';

export const exportToGist = {
  title: 'Export to Gist',
  run: async (dispatch, { bin, user }) => {
    const exporter = await import(/* webpackChunkName: "exporter" */ '../lib/exporter');
    const id = await exporter.gist(bin, user);
    dispatch(
      addNotification(
        <span>
          <a target="_blank" href={`https://gist.github.com/${id}`}>
            Gist successfully created
          </a>
        </span>
      )
    );
    dispatch(replace(`/gist/${id}`));
  },
};
