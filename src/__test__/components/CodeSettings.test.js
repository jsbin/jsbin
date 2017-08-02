/* global test */
import configureMockStore from 'redux-mock-store';
import React from 'react';
import { mount } from 'enzyme';
import expect from 'expect';
import { RESULT_PAGE } from '../../actions/session';
const mockStore = configureMockStore();

import CodeSettings from '../../containers/CodeSettings';

test('lineNumbers change trickles up to user settings', () => {
  const store = mockStore({
    editor: { lineNumbers: false, lineWrapping: false },
    user: { settings: '' },
    app: {
      source: 'javascript',
    },
    session: {
      result: RESULT_PAGE,
    },
  });

  const component = mount(<CodeSettings lineNumbers={false} store={store} />);
  const checkbox = component.find('input[name="lineNumbers"]');

  expect(checkbox.prop('checked')).toEqual(false);

  checkbox.simulate('change', { target: { checked: true } });

  expect(store.getActions()).toEqual([
    {
      type: '@@editor/SET_OPTION',
      option: 'lineNumbers',
      value: true,
    },
  ]);
});
