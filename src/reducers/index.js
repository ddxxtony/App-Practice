import { combineReducers } from 'redux';

import { createCRUDObjectReducer, cleanWhenNoUser, createCRUDArrayReducer } from './utils';
import { appInfoReducer } from './appInfo';


const ingredients=  combineReducers({
  list: createCRUDArrayReducer('Ingredient', 'websafeKey'),
  lastToken: (state = null, action) => action.type === 'LastIngredientsToken_FETCHED' ? (action.token || null) : state,
});


const objectsReducer = combineReducers({
  ingredients,
  cartItems: createCRUDObjectReducer('CartItem', 'websafeKey'),
});



export const rootReducer= combineReducers({
  
  objects: cleanWhenNoUser(objectsReducer), 
  appInfo: appInfoReducer,
  user: (state = null, action) => action.type === 'SET_USER' ? (action.user || null) : state,
});