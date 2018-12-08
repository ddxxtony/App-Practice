import { combineReducers } from 'redux';


export const appInfoReducer = combineReducers({
  refreshing: (state = false, action) => action.type === 'SET_REFRESHING' ? action.refreshing : state,
  initializing: (state = false, action) => action.type === 'SET_INITIALIZING' ? action.running : state,
});