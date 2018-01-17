import Postmate from 'postmate';
import { TOGGLE_LAYOUT } from '../actions/app';
import {
  SET_CSS,
  SET_HTML,
  SET_JS,
  SET_RESULT,
  UPDATE,
} from '../actions/processors';
import { CHANGE_RESULT } from '../actions/session';

let channel = null;
Postmate.debug = true;
const RUNNER_URL = process.env.REACT_APP_RUNNER_URL || '/runner.html';

export const subscriptions = [
  TOGGLE_LAYOUT,
  SET_CSS,
  SET_HTML,
  SET_JS,
  SET_RESULT,
  UPDATE,
  CHANGE_RESULT,
];

export const dispatch = (type, value) => {
  if (channel) {
    channel.call('dispatch', type, value);
  }
};

export class Parent {
  constructor(container) {
    // Kick off the handshake with the iFrame
    const handshake = new Postmate({
      container, // Element to inject frame into
      url: RUNNER_URL,
    });

    // When parent <-> child handshake is complete, data may be requested from the child
    handshake.then(c => {
      // Listen to a particular event from the channel
      channel = this.channel = c;
      c.on('some-event', data => console.log(data));
      c.on('dispatch', args => {
        // …?
      });
    });
  }

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

  ready() {
    return !!this.channel;
  }

  dispatch(...args) {
    if (!this.ready()) {
      this.queue.push(args);
      return;
    }

    this.channel.emit('dispatch', args);
  }
}
