import { combineReducers } from 'redux';


import { appInfoReducer } from './appInfo';

export const rootReducer= combineReducers({
  appInfo: appInfoReducer,
});