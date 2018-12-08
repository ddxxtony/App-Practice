import { handleError } from './utils';
import { utils } from 'avenaChallenge/src/controls';


export const initialize = (store) => handleError(async (dispatch, getState, { api }) => {

  dispatch({ type: 'SET_INITIALIZING', running: true });
  try {
    await api.initialize(store);
    const success = await dispatch(loadFromServer());

  } finally {
    dispatch({ type: 'SET_INITIALIZING', running: false });
  }
  return true;
}, 'Ha ocurrido un error al cerrar sesión');


export const loadFromServer = () => handleError(async (dispatch, getState, { api }) => {
  dispatch({ type: 'SET_REFRESHING', refreshing: true });
  try {
    const { user } = getState();
    if(!user) return;
    
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