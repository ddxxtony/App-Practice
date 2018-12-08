
export const initialize = (store) => async (dispatch, getState, { api }) => {
  dispatch({ type: 'SET_INITIALIZING', running: true });
  try {
    await api.initialize(store);
  } finally {
    dispatch({ type: 'SET_INITIALIZING', running: false });
  }
};

