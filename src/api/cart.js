import _ from 'lodash';
import { AsyncStorage } from 'react-native';


export class CartManager {

  constructor(api) {
    this.api = api;
    this.getStore = () => api.store;
  }

  addItemToCart = async (item) =>{
    const { websafeKey }  = item;
    const cartItemsJson = await AsyncStorage.getItem('cart') || '{}';
    const cartItems = JSON.parse(cartItemsJson);

    const { amount=0 } = cartItems[websafeKey] || {};
    item = {websafeKey, amount: amount+1, price: item.netWeight, name: item.name };
    AsyncStorage.setItem('cart', JSON.stringify({...cartItems, [item.websafeKey]:item }));
    this.getStore().dispatch({ type: 'CartItem_ADDED', objects:[item] });
    return cartItems;
  }

  deleteItemFromCart = async (item) =>{
    const cartItemsJson = await AsyncStorage.getItem('cart') || '{}';
    let cartItems = JSON.parse(cartItemsJson);
    cartItems =_.omit(cartItems, item.websafeKey);
    AsyncStorage.setItem('cart', JSON.stringify(cartItems));
    this.getStore().dispatch({ type: 'CartItem_REMOVED', objects:[item] });

    return cartItems;
  }

  updateCartItemAmount = async (item) =>{
    const cartItemsJson = await AsyncStorage.getItem('cart') || '{}';
    const cartItems = JSON.parse(cartItemsJson);
    AsyncStorage.setItem('cart', JSON.stringify({...cartItems,[item.websafeKey]:item }));
    this.getStore().dispatch({ type: 'CartItem_UPDATED', objects:[item] });

    return cartItems;
  }

  getCartItems = async () =>{
    let cartItemsJson = await AsyncStorage.getItem('cart');
    if(!cartItemsJson) return;
     const cartItems = JSON.parse(cartItemsJson);
     this.getStore().dispatch({ type: 'CartItem_FETCHED', objects:_.toArray(cartItems) });
    return cartItems;
  }

}
