import _ from 'lodash';
import base64 from 'react-native-base64'
import { formatCurrency } from 'avenaChallenge/src/controls/utils';

import { paypalSecretId, paypalclientId } from 'avenaChallenge/app.json';

const paypalTokenApi = 'https://api.sandbox.paypal.com/v1/oauth2/token';
const paymentApi = 'https://api.sandbox.paypal.com/v1/payments/payment';

const base64Credentials = base64.encode(`${paypalclientId}:${paypalSecretId}`);

export class PaypalManager {

    constructor(api) {
        this.api = api;
        this.getStore = () => api.store;
    }

    getAccessToken = async () => {
        const headers = new Headers();
        headers.append('Authorization', 'Basic ' + base64Credentials);

        const result = await fetch(`${paypalTokenApi}?grant_type=client_credentials`, {
            method: 'POST',
            headers,
        });
        const { access_token } = await result.json();
        this.token = access_token;
        return access_token;
    }

    getPaymentUrl = async (cartItems) => {
        const token = await this.getAccessToken();
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });
        headers.append('Authorization', 'Bearer ' + token);

        const [ ,total] = _.split(formatCurrency(_.sumBy(_.toArray(cartItems), ({ amount, price }) => amount * (Number(price) || 0))), '$')
        const innvoiceNumber = _.random(100000, 999999);

        let body = {
            'intent': 'sale',
            'payer': { 'payment_method': 'paypal' },
            'transactions': [
                {
                    'amount': {
                        'total': total,
                        'currency': 'MXN',
                        'details': {
                            'subtotal': total,
                            'tax': '0.00',
                            'shipping': '0.00'
                        }
                    },
                    'description': 'Compra de articulos en Avena.io',
                    'invoice_number': innvoiceNumber,
                    'soft_descriptor': 'ECHI5786786',
                    'item_list': {
                        'items': _.map(cartItems, (cartItem) => {
                            const { name, price, amount, websafeKey } = cartItem;
                            return {
                                name,
                                description: name,
                                quantity: amount,
                                price: _.split(formatCurrency(price), '$')[1],
                                currency: 'MXN',
                                sku: websafeKey
                            }
                        })
                    }
                }
            ],
            'note_to_payer': 'No dudes en contactarnos si tienes dudas sobre tu compra',
            redirect_urls: {
                return_url: 'https://success',
                cancel_url: 'https://cancelled',
            }
        };

        body = JSON.stringify(body);
        const result = await fetch(`${paymentApi}`, {
            method: 'POST',
            headers,
            body
        });

        const { id, links } = await result.json();
        const linksByRel = _.keyBy(links, 'rel');
        return _.get(linksByRel['approval_url'], 'href');
    }


    executePayment = async  ({paymentId}) => {
        const headers = new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        });
        headers.append('Authorization', 'Bearer ' + this.token);
        const result = await fetch(`${paymentApi}/${paymentId}/execute/`, {
            method: 'POST',
            headers
        });

        this.token=null;
       return _.get(await result.json(), 'id');
    }

}
