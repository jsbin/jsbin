import Postmate from 'postmate';
import { TOGGLE_LAYOUT, SET_THEME } from '../actions/app';
import {
  SET_CSS,
  SET_HTML,
  SET_JS,
  SET_RESULT,
  UPDATE,
} from '../actions/processors';
import { CHANGE_RESULT } from '../actions/session';

let channel = null;
// Postmate.debug = true;
const RUNNER_URL = process.env.REACT_APP_RUNNER_URL || '/runner.html';

export const subscriptions = [
  TOGGLE_LAYOUT,
  SET_CSS,
  SET_HTML,
  SET_JS,
  SET_RESULT,
  UPDATE,
  CHANGE_RESULT,
  TOGGLE_LAYOUT,
  SET_THEME,
];

const dispatchQueue = [];

export const dispatch = (type, value) => {
  if (channel) {
    channel.call('dispatch', type, value);
  } else {
    dispatchQueue.push([type, value]);
  }
};

let listenQueue = null;
export const listen = handler => {
  if (channel) {
    return channel.on('dispatch', handler);
  }

  listenQueue = handler;
};

export class Parent {
  constructor(container, initState) {
    // Kick off the handshake with the iFrame
    const handshake = new Postmate({
      container, // Element to inject frame into
      url: RUNNER_URL,
    });

    // When parent <-> child handshake is complete, data may be requested from the child
    handshake.then(c => {
      // Listen to a particular event from the channel
      channel = this.channel = c;
      if (listenQueue) {
        channel.on('dispatch', listenQueue);
        listenQueue = null;
      }

      channel.on('ready', () => {
        channel.call('initState', initState);
        if (dispatchQueue.length) {
          let item = null;
          // eslint-disable-next-line no-cond-assign
          while ((item = dispatchQueue.shift())) {
            dispatch(...item);
          }
        }
      });
    });
  }

  channel = null;

  remove() {
    if (this.ready()) {
      this.channel.destroy();
      channel = null;
      return true;
    }
    return false;
  }

  ready() {
    return !!this.channel;
  }
}

export class Child {
  constructor(model) {
    const handshake = new Postmate.Model(model);

    // When parent <-> child handshake is complete, events may be emitted to the parent
    handshake.then(channel => {
      this.channel = channel;
      channel.emit('ready', true);

      // TODO flush queue
    });
  }

  queue = [];

  channel = null;

  ready() {
    return !!this.channel;
  }

  dispatch(action) {
    if (!this.ready()) {
      this.queue.push(action);
      return;
    }

    this.channel.emit('dispatch', action);
  }
}
