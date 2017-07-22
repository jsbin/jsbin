import React from 'react';

function requireAuth(nextState, replace, callback) {
  const { store } = this.props;
  const { getState, dispatch } = store;
}

export default class MyRouter extends React.Component {
  constructor() {
    super();

    this.requireAuth = requireAuth.bind(this);
    // The Hot Loader Bug I ran into it makes this not work
    // this.requireAuth = this.requireAuth.bind(this);

    // Configure routes here as this solves a problem with hot loading where
    // the routes are recreated each time.
    this.routes = (
      <Route path="/" component={SomeComponent}>
        <IndexRoute component={Home} />
        <Route path="about" component={About} />
        <Route path="login" component={Login} onSubmit={this.login} />
        <Route onEnter={this.requireAuth} component={SecretStuffComponent} />
        <Route path="*" component={PageNotFound} />
      </Route>
    );
  }

  // The Hot Loader Bug I ran into it makes this not work
  // requireAuth(nextState, replace, callback) { ... }

  render() {
    const { history } = this.props;
    return (
      <Router history={history}>
        {this.routes}
      </Router>
    );
  }
}
