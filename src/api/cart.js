import _ from 'lodash';
import { AsyncStorage } from 'react-native';


export class CartManager {

  constructor(api) {
    this.api = api;
    this.getStore = () => api.store;
  }

  addItemToCart = async (item) => {
    const { websafeKey } = item;
    const store = this.getStore();
    let cartItems = store.getState().objects.cartItems    
    
    const { amount = 0 } = cartItems[websafeKey] || {};
    item = { websafeKey, amount: amount + 1, price: item.netWeight, name: item.name };
    store.dispatch({ type: 'CartItem_ADDED', objects: [item] });
    cartItems = store.getState().objects.cartItems;
    AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    return cartItems;
  }

  emptyCart = () => {
    AsyncStorage.removeItem('cart');
    this.getStore().dispatch({ type: 'CartItem_FETCHED', objects: [] });
    return true;
  }

  deleteItemFromCart = async (item) => {
    const store = this.getStore();
    store.dispatch({ type: 'CartItem_REMOVED', objects: [item] });
    const { cartItems } = store.getState().objects;
    AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    return cartItems;
  }

  updateCartItemAmount = async (item) => {
    const store =this.getStore();
    this.getStore().dispatch({ type: 'CartItem_UPDATED', objects: [item] });
    const { cartItems } = store.getState().objects;
    AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    
    return cartItems;
  }

  getCartItems = async () => {
    let cartItemsJson = await AsyncStorage.getItem('cart');
    if (!cartItemsJson) return;
    const cartItems = JSON.parse(cartItemsJson);
    this.getStore().dispatch({ type: 'CartItem_FETCHED', objects: cartItems });
    return cartItems;
  }

}
