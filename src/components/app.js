import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-native';
import NativeTachyons from 'react-native-style-tachyons';

import { LoginForm } from './loginForm';


const mapStateToProps = (state) => ({
  initializing: state.appInfo.initializing,
  refreshing: state.appInfo.refreshing,
});


export class _App extends PureComponent {

  static propTypes = {
    initializing: PropTypes.bool.isRequired,
    refreshing: PropTypes.bool.isRequired,
  }


  render() {
    return (
      <View cls='flx-i bg-white'>
        <StatusBar backgroundColor='black' barStyle='light-content' />
        <Switch>
           <Route  component={LoginForm} />
        </Switch>
      </View>
    );
  }
}


export const App = connect(mapStateToProps)(NativeTachyons.wrap(_App));