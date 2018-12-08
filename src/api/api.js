import { AsyncStorage } from 'react-native';
import base64 from 'react-native-base64'

import { apiUrl, apiUserCheckUrl } from 'avenaChallenge/app.json';
import { utils } from 'avenaChallenge/src/controls';
import { CartManager } from './cart';

const ingredientsList = [
  {
    key: '1',
    name: 'Agua ciel 600 ml',
    desc: '',
    thumb: 'https://www.kalamazoo.es/content/images/product/59577_1_xnl.jpg',
    img: 'https://www.kalamazoo.es/content/images/product/59577_1_xnl.jpg',
    price: 4.56,
    stock: 500,
    discount: 0,
  },
  {
    key: '2',
    name: 'Galletas principe',
    desc: '',
    thumb: 'http://images.sweetauthoring.com/product/54804.png',
    img: 'http://images.sweetauthoring.com/product/54804.png',
    price: 67.56,
    stock: 43,
    discount: 0,
  },
  {
    key: '3',
    name: 'Bolsa de Azucar',
    desc: '',
    thumb: 'http://cdn.shopify.com/s/files/1/0706/6309/products/mayoreototal-paquete-azucar-zulka-empacada-de-1kg-con-10-bolsas-azucar-zulka-sku_grande.jpg?v=1518347364',
    img: 'http://cdn.shopify.com/s/files/1/0706/6309/products/mayoreototal-paquete-azucar-zulka-empacada-de-1kg-con-10-bolsas-azucar-zulka-sku_grande.jpg?v=1518347364',
    price: 100.56,
    stock: 500,
    discount: 0,
  },
  {
    key: '4',
    name: 'Pimienta negra',
    desc: '600 gr',
    thumb: 'https://www.superama.com.mx/Content/images/products/img_large/0750108810234L.jpg',
    img: 'https://www.superama.com.mx/Content/images/products/img_large/0750108810234L.jpg',
    price: 4.56,
    stock: 897,
    discount: 0,
  },
  {
    key: '5',
    name: 'Bolsa de sal',
    desc: '2 kg',
    thumb: 'http://cdn.shopify.com/s/files/1/2028/1947/products/SAL_GRUESA_COVIRAN_BOLSA_1_KG_grande.png?v=1500404130',
    img: 'http://cdn.shopify.com/s/files/1/2028/1947/products/SAL_GRUESA_COVIRAN_BOLSA_1_KG_grande.png?v=1500404130',
    price: 300,
    stock: 32,
    discount: 0,
  },
  {
    key: '6',
    name: 'Jugo maggui',
    desc: '300 ml',
    thumb: 'https://elpoderdelconsumidor.org/wp-content/uploads/2015/09/maggi-jugo-100ml.png',
    img: 'https://elpoderdelconsumidor.org/wp-content/uploads/2015/09/maggi-jugo-100ml.png',
    price: 250,
    stock: 56,
    discount: 0,
  },
  {
    key: '7',
    name: 'Lechera',
    desc: 'En lata',
    thumb: 'http://cdn.shopify.com/s/files/1/0721/2151/products/IMG_0877_grande.JPG?v=1494383012',
    img: 'http://cdn.shopify.com/s/files/1/0721/2151/products/IMG_0877_grande.JPG?v=1494383012',
    price: 4.56,
    stock: 34,
    discount: 0,
  },
  {
    key: '8',
    name: 'Bolsa de arina',
    desc: 'Bolsa de arina chica 500 kg',
    thumb: 'http://images.lider.cl/wmtcl?source=url[file:/productos/3033a.jpg]&sink',
    img: 'http://images.lider.cl/wmtcl?source=url[file:/productos/3033a.jpg]&sink',
    price: 34,
    stock: 12,
    discount: 0,
  },
  {
    key: '9',
    name: 'Mayonessa mccormick',
    desc: '',
    thumb: 'https://cdn.shopify.com/s/files/1/0706/6309/products/mayoreototal-caja-mayonesa-mccormick-no8-con-24-piezas-de-190-grs-herdez-mayonesas-herdez-sku_large.jpg?v=1518347160',
    img: 'https://cdn.shopify.com/s/files/1/0706/6309/products/mayoreototal-caja-mayonesa-mccormick-no8-con-24-piezas-de-190-grs-herdez-mayonesas-herdez-sku_large.jpg?v=1518347160',
    price: 125,
    stock: 23,
    discount: 0,
  },
  {
    key: '10',
    name: 'Cátsup Heinz 397 g',
    desc: '',
    thumb: 'https://i5.walmartimages.com/asr/d844be58-01dd-4e04-b73f-f54960761c81_1.9cc053b310e64a9c12432735ec230529.jpeg',
    img: 'https://i5.walmartimages.com/asr/d844be58-01dd-4e04-b73f-f54960761c81_1.9cc053b310e64a9c12432735ec230529.jpeg',
    price: 17,
    stock: 45,
    discount: 0,
  },
];




function objToQueryString(obj) {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }
  return keyValuePairs.join('&');
}

const makeApiCall = async ({ code, method = 'GET', params='' }) => {

  var headers = new Headers();
  headers.append('Authorization', 'Basic ' + code);

  console.log(code, method, params);
  const result = await fetch(
   `${apiUrl}?${params}`,
    {
      method,
      headers: headers
    });

  const { ok } = result;
  return { ok, response: await result.json() };

}

const loadUserFromStorage = async () => {
  return JSON.parse(await AsyncStorage.getItem('user'));
};


const saveUserToStorage = (user) => {
  if (user)
    return AsyncStorage.setItem('user', JSON.stringify(user));
  else
    return AsyncStorage.removeItem('user');
};


export class Api {

  constructor() {
    this.cart = new CartManager(this);
    this.store = null;
  }

  initialize = async (store) => {
    this.store = store;

    const user = await loadUserFromStorage();
    if (user)
      store.dispatch({ type: 'SET_USER', user });
    return true;
  }

  async logIn(loginData) {
    const { email, psw } = loginData;

    const code = base64.encode(`${email}:${psw}`);

    const result = await makeApiCall({ code, params: objToQueryString({ limit: 1 })  });
    if (!result.ok) throw new Error('Datos de acceso incorrectos')

    loginData = { ...loginData, code};
    saveUserToStorage(loginData);
    this.store.dispatch({ type: 'SET_USER', user:loginData });

    return true;
  }

  logOut(loginData) {

    const { email, psw } = loginData;

    if (email !== 'test@test.test' || psw !== 'test') throw new Error('Datos de acceso incorrectos')

    saveUserToStorage(loginData);
    this.store.dispatch({ type: 'SET_USER', user: loginData });
    return true;
  }

  getIngredients = async () => {

    const { user } = this.store.getState();
    const {response, ok } = await makeApiCall({ code: user.code, params: objToQueryString({ limit: 30 }) })

    this.store.dispatch({ type: 'Ingredient_FETCHED', objects: response.items })
    this.store.dispatch({type: 'LastIngredientsToken_FETCHED', token: response.nextPageToken })
    return ingredientsList;
  }
}
