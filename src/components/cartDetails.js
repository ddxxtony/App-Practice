import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, StyleSheet, Platform, Image } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import queryString from 'query-string';
import NativeTachyons, { sizes } from 'react-native-style-tachyons';

import { utils, Button, Browser } from 'avenaChallenge/src/controls';
import { addItemToCart } from 'avenaChallenge/src/actions/cart';
import { getPaymentUrl, confirmPurchase } from 'avenaChallenge/src/actions/payments';
import { EdtiCartItemModal } from './edtiCartItemModal';
import { EmptyMessage } from './emptyMessage';

const mapStateToProps = (state) => {
    return {
        refreshing: state.appInfo.refreshing || state.appInfo.initializing,
        cartItems: state.objects.cartItems
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ addItemToCart, getPaymentUrl, confirmPurchase }, dispatch);

class _Footer extends PureComponent {
    static propTypes = {
        total: PropTypes.number,
        onPress: PropTypes.func.isRequired
    }

    render() {
        const { total, onPress } = this.props;
        return (
            <View cls='ph4 pv4'>
                <View cls='flx-row jcfe'>
                    <Text cls='gray f5 b'>Total a pagar</Text>
                    <Text cls='blue f5 ml3 b'>{utils.formatCurrency(total)}</Text>
                </View>
                <Button cls='ma4' onPress={onPress}>Pagar</Button>
            </View>
        );
    }
}

const Footer = NativeTachyons.wrap(_Footer);

class _CartItem extends PureComponent {

    static propTypes = {
        cartItem: PropTypes.object,
        onPress: PropTypes.func.isRequired
    }

    render() {
        const { cartItem, onPress } = this.props;
        const { name, amount, price } = cartItem || {};
        return (
            <TouchableOpacity cls='bg-white bb b--lightgray ph4 pv3' onPress={onPress}>
                <Text cls='gray f5'>{_.upperFirst(name)}</Text>
                <View cls='flx-row jcsb flx-i'>
                    <Text cls='lightgray'>Cantidad: {amount}</Text>
                    <Text cls='red'>{utils.formatCurrency(price * amount)}</Text>
                </View>

            </TouchableOpacity>
        );
    }
}

const CartItem = NativeTachyons.wrap(_CartItem);

class _CartDetails extends PureComponent {

    static propTypes = {
        refreshing: PropTypes.bool.isRequired,
        cartItems: PropTypes.object,
        confirmPurchase: PropTypes.func.isRequired
    }

    state = {
        loading: false,
        showModal: false,
        browserVisible: false,
    }

    startPurchase = async () => {
        const url = await this.props.getPaymentUrl();
        if (!url) return;

        this.setState({ url, browserVisible: true });
    }

    hideBrowser = () => {
        this.setState({ browserVisible: false });
    }


    confirmPurchase = async ({ url }) => {
        if (_.includes(url, 'cancelled'))
          this.setState({ browserVisible: false });
        else if (_.includes(url, 'success')) {
          const parameters = queryString.parse(url, { arrayFormat: 'index' });
           this.props.confirmPurchase({ paymentId: parameters['https://success/?paymentId'] });
          this.setState({ browserVisible: false });
        }
      }

    hideModal = () => {
        this.setState({ showModal: false, cartItem: undefined });
    }

    showCartItemEdition = (cartItem) => {
        this.setState({ showModal: true, cartItem })
    }

    cartItemRenderer = ({ item: cartItem }) => <CartItem onPress={this.showCartItemEdition.bind(null, cartItem)} loading={this.state.loading} cartItem={cartItem} />

    render() {

        const { refreshing, cartItems } = this.props;
        const { browserVisible, url } =this.state;
        const cartItemsArray = _.toArray(cartItems);
        const { showModal, cartItem } = this.state;
        const totalTopay = _.sumBy(cartItemsArray, ({ amount, price }) => amount * (Number(price) || 0));
        return (
            <View cls='flx-i'>
                <EdtiCartItemModal
                    visible={showModal}
                    cartItem={cartItem}
                    onClose={this.hideModal}
                />
                <Browser
                    visible={browserVisible}
                    url={url}
                    onClose={this.hideBrowser}
                    onNavigationChange={this.confirmPurchase}
                />
                <View cls='bg-white flx-row mh3 aic h3' >
                    <TouchableOpacity cls='flx-i' onPress={this.props.history.goBack}>
                        <Image cls='rm-contain' style={styles.back} source={require('avenaChallenge/assets/back.png')} />
                    </TouchableOpacity>
                    <View cls='ml3 flx-row aic' >
                        <Image cls='rm-contain' style={styles.icon} source={require('avenaChallenge/assets/cart.png')} />
                        <Text cls='ml2 red'>{_.sumBy(cartItemsArray, 'amount')}</Text>
                    </View>
                </View>
                <View cls='bg-ora bb b--lightgray' />
                <FlatList
                    refreshControl={<RefreshControl refreshing={refreshing} color='blue' />}
                    data={cartItemsArray}
                    ListEmptyComponent={() => <EmptyMessage message='No has agregado ningún articulo a tu carrito' />}
                    keyExtractor={({ websafeKey }) => websafeKey}
                    renderItem={this.cartItemRenderer}
                    ListFooterComponent={() => cartItemsArray.length ? <Footer total={totalTopay} onPress={this.startPurchase} /> : <View />}
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
    icon: {
        height: 25,
        width: 25
    },
    back: {
        height: 25,
        width: 25
    }
}
);

export const CartDetails = connect(mapStateToProps, mapDispatchToProps)(NativeTachyons.wrap(_CartDetails));