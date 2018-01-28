import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/Advert.css';

const AD_URL = process.env.REACT_APP_AD_URL;

class Advert extends Component {
  constructor(props) {
    super(props);
    this.timer = null;

    this.state = {
      loading: true,
    };
  }

  fetchAd = () => {
    if (!AD_URL) {
      return;
    }

    const { user = {} } = this.props;
    if (user.pro) {
      return;
    }

    return fetch(AD_URL).then(res => res.json()).then(ad => {
      this.setState({
        loading: false,
        ad,
      });

      this.timer = setTimeout(this.fetchAd, 10 * 60 * 1000); // every 10 minutes
    });
  };

  componentDidMount() {
    this.fetchAd();
  }

  componentWillReceiveProps(nextProps) {
    const { user = {} } = nextProps;
    if (user.pro) {
      this.setState({
        loading: true,
        ad: null,
      });
    } else {
      this.fetchAd();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { ad, loading = true } = this.state;

    if (loading) return null;

    const pixels = ad.pixels
      ? ad.pixels.map(pixel =>
          <img
            alt=""
            key={pixel}
            src={pixel}
            height="1"
            width="1"
            style={{ opacity: 0 }}
          />
        )
      : null;

    return (
      <div className="bsa">
        <a href={ad.url} target="_blank">
          <strong>{ad.title}:</strong> {ad.description}
        </a>
        {pixels}
      </div>
    );
  }
}

Advert.propTypes = {
  user: PropTypes.object,
};

export default (AD_URL ? Advert : () => null);
