import React from 'react';

import '../css/Loading.css';

const messages = [
  'One sec...just firing up the dobberies',
  'One sec...just firing up the dobberies...',
  `Seriously, I'm still loading, I *will* find your thing...`,
  'I know I put it here somewhere.',
  'I probably would have refreshed me by now.',
  `Wow, this is pretty bad...honestly, I shouldn't take this long`,
  'Shall we play a game whilst we wait? Snap? Dungeons and Dragons?',
  `Can you guess what I'm going to do next?`,
  '',
  '',
  '',
  '',
  '',
  '',
  `HOW ARE YOU STILL WAITING?! Sorry, seriously, something's gone wrong. Hit that reload button and hope for the best!`,
];

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.loadingTimer = null;

    this.state = {
      index: 0,
    };
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearTimeout(this.loadingTimer);
  }

  componentDidMount() {
    this.loadingTimer = setTimeout(() => {
      this.loading.hidden = false;
    }, 500);
    this.timer = setInterval(() => {
      const index = this.state.index + 1;
      if (index === messages.length) {
        clearInterval(this.timer);
        return;
      }
      this.setState({
        index,
      });
    }, 5000);
  }

  render() {
    const { index } = this.state;
    const classNames = { [index]: 'active' };
    return (
      <div className="Loading" ref={e => (this.loading = e)} hidden={true}>
        <div className="message">
          {messages.map((m, i) =>
            <p key={`message-${i}`} className={classNames[i] || ''}>
              {m}
            </p>
          )}
        </div>
        <div className="loader" />
      </div>
    );
  }
}
