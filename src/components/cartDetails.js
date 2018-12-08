import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, StyleSheet, Platform, Image } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NativeTachyons, { sizes } from 'react-native-style-tachyons';

import { utils, Button } from 'avenaChallenge/src/controls';
import { addItemToCart } from 'avenaChallenge/src/actions/cart';
import { EdtiCartItemModal } from './edtiCartItemModal';


const mapStateToProps = (state) => {
    return {
        refreshing: state.appInfo.refreshing || state.appInfo.initializing,
        cartItems: state.objects.cartItems
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({ addItemToCart }, dispatch);

class _Footer extends PureComponent {
    static propTypes = {
        total: PropTypes.number
    }

    render() {
        const { total } = this.props;
        return (
            <View cls='ph4 pv4'>
                <View cls='flx-row jcfe'>
                    <Text cls='gray f5 b'>Total a pagar</Text>
                    <Text cls='blue f5 ml3 b'>{utils.formatCurrency(total)}</Text>
                </View>
                <Button cls='ma4'>Pagar</Button>
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
        cartItems: PropTypes.object
    }

    state = {
        loading: false,
        showModal: false
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
                <View cls='bg-white flx-row mh3 aic h3' >
                    <TouchableOpacity cls='flx-i' onPress={this.props.history.goBack}>
                        <Image cls='rm-contain' style={styles.logo} source={require('avenaChallenge/assets/dig.png')} />
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
                    keyExtractor={({ websafeKey }) => websafeKey}
                    renderItem={this.cartItemRenderer}
                    ListFooterComponent={() => cartItemsArray.length ? <Footer total={totalTopay} /> : <View />}
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
    logo: {
        height: 35,
        width: 55
    }
}
);

export const CartDetails = connect(mapStateToProps, mapDispatchToProps)(NativeTachyons.wrap(_CartDetails));