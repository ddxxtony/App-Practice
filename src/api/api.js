import { AsyncStorage } from 'react-native';
import base64 from 'react-native-base64'
import  _ from 'lodash';

import { apiUrl } from 'avenaChallenge/app.json';
import { CartManager } from './cart';


function objToQueryString(obj) {
  obj = _.pickBy(obj);
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }
  return keyValuePairs.join('&');
}

const makeApiCall = async ({ code, method = 'GET', params='' }) => {

  var headers = new Headers();
  headers.append('Authorization', 'Basic ' + code);
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

  getIngredients = async (nextPageToken) => {

    const { user } = this.store.getState();
    const { response } = await makeApiCall({ code: user.code, params: objToQueryString({ limit: 30, nextPageToken}) })


    this.store.dispatch({ type: `Ingredient_${nextPageToken?'ADDED':'FETCHED'}`, objects: response.items })
    this.store.dispatch({type: 'LastIngredientsToken_FETCHED', token: response.nextPageToken })
    return response.items;
  }
}
