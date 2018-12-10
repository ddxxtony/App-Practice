import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-native';
import NativeTachyons from 'react-native-style-tachyons';

import { LoginForm } from './loginForm';
import { IngredientsList } from './ingredientsList';
import { CartDetails } from './cartDetails';


const mapStateToProps = (state) => ({
  initializing: state.appInfo.initializing,
  refreshing: state.appInfo.refreshing,
  user: state.user,
});


export class _App extends PureComponent {

  static propTypes = {
    initializing: PropTypes.bool.isRequired,
    refreshing: PropTypes.bool.isRequired,
    user: PropTypes.object
  }


  render() {
    const { user } = this.props;
    return (
      <View cls='flx-i bg-white'>
        <StatusBar backgroundColor='black' barStyle='light-content' />
        <Switch>
          {!user && <Route component={LoginForm} />}
          <Route exact path='/:action(search)?' component={IngredientsList} />
          <Route exact path='/cart-details' component={CartDetails} />
        </Switch>
      </View>
    );
  }
}


export const App = connect(mapStateToProps)(NativeTachyons.wrap(_App));