import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, RefreshControl, StyleSheet, Platform, Image } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NativeTachyons, { sizes } from 'react-native-style-tachyons';
import { Link } from 'react-router-native';
import { createSelector } from 'reselect';

import { utils } from 'avenaChallenge/src/controls';
import { addItemToCart } from 'avenaChallenge/src/actions/cart';


const makeMapStateToProps = () => {
  const getUrlParams = utils.makeGetUrlParams({ search: '' });
  const getIngredients = createSelector(
    (state) => state.objects.ingredients.list,
    getUrlParams,
    (ingredients, urlParams) =>
      _(utils.filterObjects(ingredients, { filter: urlParams.search, columns: ['name', 'price'] }))
      .filter('reviewed')
        .value()
  );

  return (state, props) => {
    return {
      refreshing: state.appInfo.refreshing || state.appInfo.initializing,
      ingredients: getIngredients(state, props),
      urlParams: getUrlParams(state, props),
      cartItems: state.objects.cartItems
    };
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ addItemToCart }, dispatch);

class _Ingredient extends PureComponent {

  static propTypes = {
    ingredient: PropTypes.object,
    onTap: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
  }

  render() {
    const { ingredient, onTap, loading } = this.props;
    const { name, netWeight, energyCal } = ingredient || {};
    return (
      <TouchableOpacity onPress={onTap} disabled={loading} cls='bg-white bb b--lightgray flx-row aic ph3 pv3'>
        <View cls='h3 w3 mv1 bg-white aic jcc'  >
          <Image source={require('avenaChallenge/assets/noImage.png')} cls='rm-cover h3 w3' />
        </View>
        <View cls='ml3'>
          <Text cls='gray f5'>{_.upperFirst(name)}</Text>
          <View cls='flx-row'>
            <Text cls='red'>{utils.formatCurrency(netWeight)}</Text>
            <Text cls='ml3 lightgray'>calorias: {energyCal}</Text>
          </View>

        </View>
      </TouchableOpacity>
    );
  }
}

const Ingredient = NativeTachyons.wrap(_Ingredient);

class _IngredientsList extends PureComponent {

  static propTypes = {
    refreshing: PropTypes.bool.isRequired,
    ingredients: PropTypes.array,
    urlParams: PropTypes.object.isRequired,
    addItemToCart: PropTypes.func.isRequired,
    cartItems: PropTypes.object
  }

  state = {
    loading: false,
    showSearchBar: false,
  }

  onTap = async (item) => {
    this.setState({ loading: true });
    await this.props.addItemToCart(item);
    this.setState({ loading: false });
  }

  toggleSearchBar = () => {
    const { showSearchBar } = this.state;
    if (showSearchBar)
      this.onSearchChange(undefined);
    this.setState({
      showSearchBar: !showSearchBar
    })
  }

  ingredientRenderer = ({ item: ingredient }) => <Ingredient key={ingredient.websafeKey} loading={this.state.loading} ingredient={ingredient} onTap={this.onTap.bind(null, ingredient)} />
  onSearchChange = utils.createQueryStringHandler(this, 'search');

  render() {

    const { refreshing, ingredients, urlParams, cartItems } = this.props;
    const { search } = urlParams;
    const { showSearchBar } = this.state;

    return (
      <View cls='flx-i'>
        <View cls='bg-white flx-row mh3 aic h3' >
          {showSearchBar ?
            <TextInput cls='ba b--gray mv2 br3 f4 tc black flx-i ' style={styles.searchBar} placeholderTextColor='gray' underlineColorAndroid='transparent' placeholder='Buscar' onChangeText={this.onSearchChange} value={search} />
            : <TouchableOpacity cls='flx-i'>
              <Image cls='rm-contain' style={styles.logo} source={require('avenaChallenge/assets/dig.png')} />
            </TouchableOpacity>}
          {showSearchBar ?
            <TouchableOpacity cls='ml3' onPress={this.toggleSearchBar} >
              <Image cls='rm-contain' style={styles.searchImage} source={require('avenaChallenge/assets/cross.png')} />
            </TouchableOpacity>
            : <TouchableOpacity cls='ml3' onPress={this.toggleSearchBar} >
              <Image cls='rm-contain' style={styles.searchImage} source={require('avenaChallenge/assets/search.png')} />
            </TouchableOpacity>}
          < Link component={TouchableOpacity} to='/cart-details' cls='ml3 flx-row aic' >
            <Image cls='rm-contain' style={styles.searchImage} source={require('avenaChallenge/assets/cart.png')} />
            <Text cls='ml2 red'>{_.sumBy(_.toArray(cartItems), 'amount')}</Text>
          </Link>
        </View>
        <View cls='bg-ora bb  b--lightgray' />
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} color='blue' />}
          data={ingredients}
          keyExtractor={({ websafeKey }) => websafeKey}
          renderItem={this.ingredientRenderer}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({

  searchBar: {
    ...Platform.select({
      ios: {
        paddingTop: sizes.pt2,
        paddingBottom: sizes.pt2,
      },
      android: {
        paddingTop: sizes.pt1,
        paddingBottom: sizes.pt1,
      },
    }),
  },
  searchImage: {
    height: 25,
    width: 25
  },
  logo: {
    height: 35,
    width: 55
  }
}
);

export const IngredientsList = connect(makeMapStateToProps, mapDispatchToProps)(NativeTachyons.wrap(_IngredientsList));