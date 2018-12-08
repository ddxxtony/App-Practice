import { loadFromServer } from './initializers';
import { handleError } from './utils';
import { utils } from 'avenaChallenge/src/controls';


export const addItemToCart = (ingredient) => handleError(async (dispatch, getState, { api }) => {
  await api.cart.addItemToCart(ingredient);
  return true;
}, 'Ha ocurrido un error al iniciar sesión');


export const deleteItemFromCart = (cartItem) => handleError(async (dispatch, getState, { api }) => {
  await api.cart.deleteItemFromCart(cartItem);
  return true;
}, 'Ha ocurrido un error al borrar este elemento de su carrito');

export const editItemAmounInCart = (cartItem) => handleError(async (dispatch, getState, { api }) => {
  await api.cart.updateCartItemAmount(cartItem);
  return true;
}, 'Ha ocurrido un error al actualizar su carrito');