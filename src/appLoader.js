import React from 'react';
import thunk from 'redux-thunk';
import { AppRegistry, StyleSheet } from 'react-native';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-native';
import { createMemoryHistory as createHistory } from 'history';
import NativeTachyons from 'react-native-style-tachyons';
import moment from 'moment';
import 'moment/locale/es';

import { name as appName } from 'avenaChallenge/app.json';
import { palette, rem, fonts } from './theme';
import { rootReducer } from './reducers';
import { initialize } from './actions/initializers';
import { Api } from './api';

const api = new Api();
const history = createHistory();
const store = createStore(rootReducer, compose(applyMiddleware(thunk.withExtraArgument({ api, history }))));
store.dispatch(initialize(store));

moment.locale('es');
NativeTachyons.build({ rem, fonts, colors: { palette } }, StyleSheet);

const { App } = require('./components/app');
const Bootstrapper = () => (
  <Provider store={store}>
    <Router history={history} >
      <Route component={App} />
    </Router>
  </Provider>
);

AppRegistry.registerComponent(appName, () => Bootstrapper);