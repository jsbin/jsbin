import React from 'react';
import { replace } from 'react-router-redux';
import { addNotification, ERROR } from '../../actions/notifications';

export const exportToGist = {
  title: 'Save to Gist',
  meta: 'export gist',
  run: async (dispatch, { bin, user }) => {
    const exporter = await import(/* webpackChunkName: "exporter" */ '../../lib/exporter');
    const id = await exporter.gist(bin, user);
    if (id === false) {
      dispatch(
        addNotification(
          <span>Failed to create gist. See browser console for details.</span>,
          ERROR
        )
      );
      return;
    }
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
