import { handleError } from './utils';
import { utils } from 'avenaChallenge/src/controls';
import { appStart } from './app';


export const initialize = (store) => handleError(async (dispatch, getState, { api }) => {

  dispatch({ type: 'SET_INITIALIZING', running: true });
  try {
    await api.initialize(store);
    await dispatch(appStart());

    await dispatch(loadFromServer());
  } finally {
    dispatch({ type: 'SET_INITIALIZING', running: false });
  }
  return true;
}, 'Ha ocurrido un error al inicializar la aplicación');

export const loadNextPage = () => handleError(async (dispatch, getState, { api }) => {
  if(getState().appInfo.refreshing) return;
  dispatch({ type: 'SET_REFRESHING', refreshing: true });
  try {
    const { lastToken } = getState().objects.ingredients;
    await api.getIngredients(lastToken);
    return true;
  } finally {
    dispatch({ type: 'SET_REFRESHING', refreshing: false });
  }
}, 'No se pudieron descargar los datos del servidor');

export const makeSearch = (search) => handleError(async (dispatch, getState, { api }) => {
  dispatch({ type: 'SET_REFRESHING', refreshing: true });
  try {
    await api.getSearchedIngredients(undefined, search);
    return true;
  } finally {
    dispatch({ type: 'SET_REFRESHING', refreshing: false });
  }
}, 'Ha ocurrido un error al intentar realizar la búsqueda');


export const loadNextPageFromSearch = (search) => handleError(async (dispatch, getState, { api }) => {
  if(getState().appInfo.refreshing) return;
  dispatch({ type: 'SET_REFRESHING', refreshing: true });
  try {
    const { lastToken } = getState().objects.ingredients;
    await api.getSearchedIngredients(lastToken, search);
    return true;
  } finally {
    dispatch({ type: 'SET_REFRESHING', refreshing: false });
  }
}, 'No se pudieron descargar los datos del servidor');


export const loadFromServer = () => handleError(async (dispatch, getState, { api }) => {
  dispatch({ type: 'SET_REFRESHING', refreshing: true });
  try {
    const { user } = getState();
    if (!user) return;

    await Promise.race([
      Promise.all([
        api.getIngredients(),
        api.cart.getCartItems()
      ]),
      utils.delay(5000).then(() => Promise.reject(new Error('Se ha agotado el tiempo de espera para conectarse con el servidor')))
    ]);

    return true;
  } finally {
    dispatch({ type: 'SET_REFRESHING', refreshing: false });
  }
}, 'No se pudieron descargar los datos del servidor');