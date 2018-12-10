import { handleError } from './utils';

export const addItemToCart = (item) => handleError((dispatch, getState) => {
  const { websafeKey } = item;
  let { cartItems } = getState().objects;
  const { amount = 0 } = cartItems[websafeKey] || {};
  item = { websafeKey, amount: amount + 1, price: item.netWeight, name: item.name };
  dispatch({ type: 'CartItem_ADDED', objects: [item] });
  return true;
}, 'Ha ocurrido un error al agregar elemento al carrito');

export const deleteItemFromCart = (cartItem) => handleError((dispatch) => {
  dispatch({ type: 'CartItem_REMOVED', objects: [cartItem] });
  return true;
}, 'Ha ocurrido un error al borrar este elemento de su carrito');

export const editItemAmounInCart = (cartItem) => handleError((dispatch) => {
  dispatch({ type: 'CartItem_UPDATED', objects: [cartItem] });
  return true;
}, 'Ha ocurrido un error al actualizar su carrito');

export const saveCart = () => handleError(async (dispatch, getState, { api }) => {
  await api.cart.saveCart();
  return true;
}, 'Ha ocurrido un error al tratar de guardar su carrito');