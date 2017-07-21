import fetch from 'isomorphic-fetch';

const API = process.env.REACT_APP_API;

const settings = ({ opts, token } = {}) => {
  const headers = {
    // 'content-type': 'application/json'
  };
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  return {
    mode: 'cors',
    headers,
    ...opts
  };
};

export const getBin = (id, revision = 'latest') => {
  return fetch(`${API}/bin/${id}/${revision}`, settings()).then(res =>
    res.json()
  );
};
