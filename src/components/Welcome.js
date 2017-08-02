import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import Head from './Head';
import Layout from '../containers/PageLayout';

import { cmd } from '../lib/is-mac';

import '../css/Welcome.css';

const noop = () => {};

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.updateShowWelcome = this.updateShowWelcome.bind(this);
    this.welcomeSeen = this.welcomeSeen.bind(this);
    this.state = {
      loadingHelp: true,
      blog: [],
      help: [],
    };
  }

  welcomeSeen() {
    Cookies.set('welcomeSeen', true);
  }

  updateShowWelcome(e) {
    this.props.updateShowWelcome(e.target.checked);
  }

  componentDidMount() {
    fetch('https://jsbin.com/help/search.json')
      .then(res => {
        if (res.status === 200) {
          return res.json();
        }
        throw new Error('not found');
      })
      .then(json => {
        const help = json
          .filter(({ type }) => type === 'help')
          .filter(({ category }) => category === 'learn')
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
        const blog = json.filter(({ type }) => type === 'blog').reverse();
        this.setState({ loadingHelp: false, help, blog });
      })
      .catch(() => {
        this.setState({ loadingHelp: false });
      });
  }

  render() {
    const { help, loadingHelp } = this.state;
    const { showWelcome } = this.props;
    return (
      <Layout className="Welcome">
        <Head title={`👋 JS Bin`} />

        <div className="flex-col">
          <div className="col">
            <div className="block flex">
              <h1>Welcome to JS Bin</h1>
              <div className="jsbin-moto">
                <img height="100" src="/images/favicon.svg" alt="" />
                <ul>
                  <li>Hack.</li>
                  <li>Learn.</li>
                  <li>Fix.</li>
                  <li>Teach.</li>
                </ul>
              </div>
            </div>
            <div className="block flex">
              <h2>Get started</h2>
              <ul>
                <li>
                  <a onClick={this.welcomeSeen} href="/">
                    <strong>New bin</strong>
                  </a>
                </li>
                <li>
                  <a href="/open">Open existing bin</a>
                </li>
                <li>
                  <a href="/account">Your account</a>
                </li>
              </ul>
            </div>
            <div className="block flex">
              <h2>Help</h2>
              <p>A few topics to get you started</p>
              <ul>
                {loadingHelp
                  ? <li>Loading help…</li>
                  : help.map(({ title, slug }, i) => {
                      return (
                        <li key={'help-' + i}>
                          <a target="_blank" href={`https://jsbin.com/${slug}`}>
                            {title}
                          </a>
                        </li>
                      );
                    })}
                <li>
                  <a href="https://jsbin.com/help">
                    <strong>
                      <span role="img" aria-labelledby="">
                        ⭐️
                      </span>{' '}
                      See all the help topics
                    </strong>
                  </a>
                </li>
              </ul>
            </div>
            <div className="block shrink">
              <p>
                <label>
                  <input
                    checked={showWelcome}
                    onChange={this.updateShowWelcome}
                    type="checkbox"
                  />Show welcome screen on startup
                </label>
              </p>
            </div>
          </div>
          <div className="col">
            <div className="block">
              <h2>Discover</h2>

              <a href="/help/palette" className="discover">
                <h3>Use the palette for quick navigation</h3>
                <p>
                  Use the keyboard shortcut {cmd}+shift+p
                </p>
              </a>

              <a href="/help/recording" className="discover">
                <h3>Help others with your steps</h3>
                <p>
                  Recording the steps you make to explain changes and fixes you
                  make.
                </p>
              </a>

              <a href="/help/linking" className="discover">
                <h3>Linking and embedding</h3>
                <p>
                  Include live examples and "scoop" links in your blog posts.
                </p>
              </a>
            </div>

            <div className="block">
              <h2>Get your license</h2>
              <p>Nothing to see here just yet.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

Welcome.propTypes = {
  updateShowWelcome: PropTypes.func,
  showWelcome: PropTypes.bool,
};

Welcome.defaultProps = {
  updateShowWelcome: noop,
  showWelcome: true,
};

export default Welcome;
