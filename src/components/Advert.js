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
      const ads = res.ads.filter(ad => ad.active);
      const ad = ads[(ads.length * Math.random()) | 0];
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

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    const { ad, loading = true } = this.state;

    if (loading) return null;

    const pixels = (ad.pixel || '').split('||');
    const time = Math.round(Date.now() / 10000) | 0;
    const images = pixels.map(pixel =>
      <img
        alt=""
        key={pixel}
        src={pixel.replace('[timestamp]', time)}
        height="1"
        width="1"
        style={{ opacity: 0 }}
      />
    );

    return (
      <div className="bsa">
        <a href={ad.statlink} target="_blank">
          {ad.title}: {ad.description}
        </a>
        {images}
      </div>
    );
  }
}

Advert.propTypes = {
  user: PropTypes.object,
};

export default (AD_URL ? Advert : () => null);
