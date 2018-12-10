import { combineReducers } from 'redux';


export const appInfoReducer = combineReducers({
  state: (state = 'unknown', action) => action.type === 'APPSTATE_CHANGED' ? action.state : state,
  refreshing: (state = false, action) => action.type === 'SET_REFRESHING' ? action.refreshing : state,
  initializing: (state = false, action) => action.type === 'SET_INITIALIZING' ? action.running : state,
});