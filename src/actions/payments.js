import { handleError } from './utils';
import { utils } from 'avenaChallenge/src/controls';


export const getPaymentUrl = () => handleError(async (dispatch, getState, { api }) => {

 const {cartItems } =  getState().objects;
 const url =  await api.paypal.getPaymentUrl(cartItems);
  return url;
}, 'Ha ocurrido un error al tratar de generar el pago');

export const confirmPurchase = (data) => handleError(async (dispatch, getState, { api }) => {
    await api.paypal.executePayment(data);
    await api.cart.emptyCart();
    utils.showDialog('Compra exitosa', 'Su compra se realizo correctamente, gracias por su preferencia')
    return true;
}, 'Ha ocurrido un error al tratar de generar el pago');


