import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, TextInput, RefreshControl, StyleSheet, Platform, Image, FlatList } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NativeTachyons, { sizes } from 'react-native-style-tachyons';
import { Link } from 'react-router-native';
import { createSelector } from 'reselect';

import { utils } from 'avenaChallenge/src/controls';
import { addItemToCart } from 'avenaChallenge/src/actions/cart';
import { logOut } from 'avenaChallenge/src/actions/auth';
import { loadNextPage, makeSearch, loadNextPageFromSearch, loadFromServer } from 'avenaChallenge/src/actions/initializers';
import { EmptyMessage } from './emptyMessage';



const makeMapStateToProps = () => {
  const getUrlParams = utils.makeGetUrlParams({ search: '' });
  const getIngredients = createSelector(
    (state) => state.objects.ingredients.list,
    (ingredients) =>   _.filter(ingredients, 'reviewed')
  );

  const getIngredientsSearchResult = createSelector(
    (state) => state.objects.ingredientsSearch.list,
    getUrlParams,
    (ingredients, urlParams) =>
      _(utils.filterObjects(ingredients, { filter: urlParams.search, columns: ['name'] }))
        .filter('reviewed')
        .value()
  );

  return (state, props) => {
    const showSearchBar = props.match.params.action === 'search';
    return {
      refreshing: state.appInfo.refreshing || state.appInfo.initializing,
      ingredients: showSearchBar ? getIngredientsSearchResult(state, props) : getIngredients(state, props),
      urlParams: getUrlParams(state, props),
      cartItems: state.objects.cartItems,
      showSearchBar
    };
  };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ addItemToCart, loadNextPage, makeSearch, loadNextPageFromSearch, logOut, loadFromServer }, dispatch);

class _Ingredient extends PureComponent {

  static propTypes = {
    ingredient: PropTypes.object,
    onTap: PropTypes.func.isRequired,
  }

  render() {
    const { ingredient, onTap } = this.props;
    const { name, netWeight, energyCal } = ingredient || {};
    return (
      <TouchableOpacity onPress={onTap} cls='bg-white bb b--lightgray flx-row aic ph3 pv3 '>
        <View cls='h3 w3 mv1 bg-white aic jcc ba'  >
          <Image source={require('avenaChallenge/assets/noImage.png')} cls='rm-cover h3 w3' />
        </View>
        <View cls='ml3'>
          <Text cls='gray f5'>{_.upperFirst(name)}</Text>
          <View cls='flx-row'>
            <Text cls='red'>{utils.formatCurrency(netWeight)}</Text>
            <Text cls='ml3 lightgray'>calorías: {energyCal}</Text>
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
    cartItems: PropTypes.object,
    loadNextPage: PropTypes.func.isRequired,
    makeSearch: PropTypes.func.isRequired,
    loadNextPageFromSearch: PropTypes.func.isRequired,
    logOut: PropTypes.func.isRequired,
    loadFromServer: PropTypes.func.isRequired

  }

  state = {
    loading: false,
  }

  onTap = (item) => () => this.props.addItemToCart(item);

  makeSearch = _.debounce(this.props.makeSearch, 300);

  componentDidUpdate({ urlParams: oldUrlParams }) {
    const { search } = this.props.urlParams;
    if (oldUrlParams.search !== search) {
      this.makeSearch(search);
    }
  }

  onEnReachedWithSearch = () => {
    const { urlParams, loadNextPageFromSearch } = this.props;
    loadNextPageFromSearch(urlParams.search);
  }

  onSearchCancelled = () => {
    this.onSearchChange(undefined);
    this.props.history.replace('/')
  }

  ingredientRenderer = ({ item: ingredient }) => <Ingredient ingredient={ingredient} onTap={this.onTap(ingredient)} />
  onSearchChange = utils.createQueryStringHandler(this, 'search');

  render() {

    const { refreshing, ingredients, loadFromServer,  urlParams, cartItems, loadNextPage, showSearchBar, logOut } = this.props;
    const { search } = urlParams;

    return (
      <View cls='flx-i'>
        <View cls='bg-white flx-row mh3 aic h3' >
          {showSearchBar ?
            <TextInput cls='ba b--gray mv2 br3 f4 tc black flx-i ' style={styles.searchBar} placeholderTextColor='gray' underlineColorAndroid='transparent' placeholder='Buscar' onChangeText={this.onSearchChange} value={search} />
            : <View cls='flx-i flx-row aic'>
              <TouchableOpacity onPress={logOut}>
                <Image cls='rm-contain' style={styles.logOut} source={require('avenaChallenge/assets/logOut.png')} />
              </TouchableOpacity>
            </View>
          }
          {showSearchBar ?
            <TouchableOpacity onPress={this.onSearchCancelled} cls='ml3' >
              <Image cls='rm-contain' style={styles.searchImage} source={require('avenaChallenge/assets/cross.png')} />
            </TouchableOpacity>
            : <Link component={TouchableOpacity} to='/search' cls='ml3' onPress={this.toggleSearchBar} >
              <Image cls='rm-contain' style={styles.searchImage} source={require('avenaChallenge/assets/search.png')} />
            </Link>}
          < Link component={TouchableOpacity} to='/cart-details' cls='ml3 flx-row aic' >
            <Image cls='rm-contain' style={styles.searchImage} source={require('avenaChallenge/assets/cart.png')} />
            <Text cls='ml2 red'>{_.sumBy(_.toArray(cartItems), 'amount')}</Text>
          </Link>
        </View>
        <View cls='bg-ora bb  b--lightgray' />
        <View cls='flx-i'>
          <FlatList
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadFromServer}  color='blue' />}
            data={ingredients}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={25}
            windowSize={5}
            initialNumToRender={15}
            keyExtractor={({ websafeKey }) => websafeKey}
            removeClippedSubviews={true}
            renderItem={this.ingredientRenderer}
            ListEmptyComponent={() => <EmptyMessage message='No hay elementos para mostrar' />}
            onEndReached={showSearchBar ? this.onEnReachedWithSearch : loadNextPage}
          />
        </View>
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
  logOut: {
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