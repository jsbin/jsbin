import React from 'react';
import { Command, Shift } from '../../components/Symbols';
import { SAVE } from '../../actions/bin';
import { addNotification } from '../../actions/notifications';
import { replace } from 'react-router-redux';

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

export const share = {
  title: 'Share',
  shortcut: (
    <kbd>
      <Command /> <Shift /> S
    </kbd>
  ),
  condition: ({ user }) => !!user.username && user.pro,
  run: async (dispatch, { bin, user }) => {
    const exporter = await import(/* webpackChunkName: "exporter" */ '../../lib/exporter');
    const id = await exporter.jsbin(bin, user);

    console.log(id);

    const url = `https://jsbin.com/${id}`;

    dispatch(
      addNotification(
        <span>
          Created: <a target="_blank" href={url}>{url}</a>
        </span>
      )
    );
    dispatch(replace(`/${id}`));
  },
};
