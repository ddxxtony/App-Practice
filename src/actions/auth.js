import { loadFromServer } from './initializers';
import { handleError } from './utils';
import { utils } from 'avenaChallenge/src/controls';


export const logIn = (loginData) => handleError(async (dispatch, getState, { api }) => {
  await api.logIn(loginData);
  dispatch(loadFromServer());
  return true;
}, 'Ha ocurrido un error al iniciar sesión');


export const logOut = () => handleError(async (dispatch, getState, { api }) => {

  await utils.delay(1000); //api.logOut();

  return true;
}, 'Ha ocurrido un error al cerrar sesión');

