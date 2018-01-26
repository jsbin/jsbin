import React from 'react';
import { Route, Switch } from 'react-router';
import Loadable from 'react-loadable';
import LoadingComponent from './components/Loading';

// main pages async loading
const Settings = Loadable({
  loader: () =>
    import(/* webpackChunkName: "settings" */ './containers/Settings'),
  loading: LoadingComponent,
});
const Welcome = Loadable({
  loader: () =>
    import(/* webpackChunkName: "welcome" */ './containers/Welcome'),
  loading: LoadingComponent,
});
const Login = Loadable({
  loader: () => import(/* webpackChunkName: "login" */ './containers/Login'),
  loading: LoadingComponent,
});
const Logout = Loadable({
  loader: () => import(/* webpackChunkName: "logout" */ './containers/Logout'),
  loading: LoadingComponent,
});
const Account = Loadable({
  loader: () =>
    import(/* webpackChunkName: "account" */ './containers/Account'),
  loading: LoadingComponent,
});

export default ({ App }) =>
  <Switch>
    <Route exact path="/" component={App} />
    <Route exact path="/settings" component={Settings} />
    <Route exact path="/welcome" component={Welcome} />
    <Route exact path="/login" component={Login} />
    <Route exact path="/logout" component={Logout} />
    <Route path="/account/:subPage?/:id?" component={Account} />

    <Route exact path="/local/:localId" component={App} />
    <Route exact path="/gist/:gistId" component={App} />
    <Route exact path="/post/:postId" component={App} />
    <Route exact path="/:bin/:version/(embed|edit)?" component={App} />
    <Route exact path="/:bin/(embed|edit)?" component={App} />
  </Switch>;
