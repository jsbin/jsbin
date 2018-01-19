import React from 'react';
import { Command } from '../../components/Symbols';
import { SAVE } from '../../actions/bin';
import { addNotification } from '../../actions/notifications';
import { replace } from 'react-router-redux';

const ORIGIN = process.env.REACT_APP_ORIGIN || window.location.origin;

export const save = {
  title: 'Save',
  shortcut: (
    <kbd>
      <Command /> S
    </kbd>
  ),
  run: dispatch => {
    dispatch({ type: SAVE });
  },
};

export const publish = {
  title: 'Publish',
  condition: ({ user }) => !!user.username && user.pro,
  run: async (dispatch, { bin, user }) => {
    const exporter = await import(/* webpackChunkName: "exporter" */ '../../lib/exporter');
    const { id } = await exporter.jsbin(bin, user);

    console.log(id);

    const url = `${ORIGIN}/${id}`;

    // if created…
    dispatch(
      addNotification(
        <span>
          Created:{' '}
          <a target="_blank" href={url}>
            {url}
          </a>
        </span>
      )
    );
    dispatch(replace(`/${id}`));
  },
};
