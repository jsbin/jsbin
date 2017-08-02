import React from 'react';

export default class Router extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { history } = this.props;
    return (
      <Router history={history}>
        {this.routes}
      </Router>
    );
  }
}
