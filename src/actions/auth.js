import { loadFromServer } from './initializers';
import { handleError } from './utils';

export const logIn = (loginData) => handleError(async (dispatch, getState, { api }) => {
  await api.logIn(loginData);
  dispatch(loadFromServer());
  return true;
}, 'Ha ocurrido un error al iniciar sesión');

export const logOut = () => handleError(async (dispatch, getState, { api }) => {
  api.logOut();
  return true;
}, 'Ha ocurrido un error al cerrar sesión');

