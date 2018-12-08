import _ from 'lodash';

export const createCRUDObjectReducer = (prefix, key = 'id') => (state = {}, action) => {
  switch (action.type) {
    case `${prefix}_FETCHED`:
      return _.keyBy(action.objects, key);
    case `${prefix}_ADDED`:
    case `${prefix}_UPDATED`:
      return { ...state, ..._.keyBy(action.objects, key) };
    case `${prefix}_REMOVED`:
      return _(action.objects).map(key).reduce((acc, cur) => (delete acc[cur], acc), { ...state });
    case 'REMOVE_OLD_OBJECTS':
      return _.pickBy(state, (obj) => _.isUndefined(obj.downloadedAt) || obj.downloadedAt > action.timestamp);
    default: return state;
  }
};


export const cleanWhenNoUser = (reducer) => (state, action) => reducer((action.type === 'SET_USER' && !action.user) ? undefined : state, action);