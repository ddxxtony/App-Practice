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
    default: return state;
  }
};

export const createCRUDArrayReducer = (prefix) => {
  if (_.isString(prefix)) prefix = [prefix];
  const fetched = new Set(_.map(prefix, (p) => `${p}_FETCHED`));
  const added = new Set(_.map(prefix, (p) => `${p}_ADDED`));
  return (state = [], action) => {
    if (fetched.has(action.type))
      return action.objects;
    if (added.has(action.type))
      return [ ...state, ...action.objects ];
    return state;
  };
};


export const cleanWhenNoUser = (reducer) => (state, action) => reducer((action.type === 'SET_USER' && !action.user) ? undefined : state, action);