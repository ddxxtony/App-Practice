
export class Api {

  constructor() {
    this.store = null;
  }

  initialize = (store) => {
    this.store = store;

    return true;
  }

  logIn({ } = {}) {
    const currentUser = this.store.getState().userInfo.user;

    if (currentUser) {
      throw new Error('Already authenticated logout first');
    }
    return true;
  }

  logOut() {

    this.store.dispatch({ type: 'SET_USER', user: null });
    return true;
  }

}