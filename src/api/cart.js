import _ from 'lodash';
import { AsyncStorage } from 'react-native';


export class CartManager {

  constructor(api) {
    this.api = api;
    this.getStore = () => api.store;
  }

  saveCart = () => {
    const cartItems = this.getStore().getState().objects.cartItems;
    AsyncStorage.setItem('cart', JSON.stringify(cartItems));
  }

  getCartItems = async () => {
    let cartItemsJson = await AsyncStorage.getItem('cart');
    if (!cartItemsJson) return;
    const cartItems = JSON.parse(cartItemsJson);
    this.getStore().dispatch({ type: 'CartItem_FETCHED', objects: cartItems });
    return cartItems;
  }

  emptyCart = () => {
    AsyncStorage.removeItem('cart');
    this.getStore().dispatch({ type: 'CartItem_FETCHED', objects: [] });
    return true;
  }

}
