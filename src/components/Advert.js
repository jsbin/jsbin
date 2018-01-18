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
    fetch(AD_URL).then(res => res.json()).then(res => {
      this.setState({
        loading: false,
        ad: res,
      });

      this.timer = setTimeout(this.fetchAd, 10 * 60 * 1000); // every 10 minutes
    });
  };

  componentDidMount() {
    if (AD_URL) this.fetchAd();
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
