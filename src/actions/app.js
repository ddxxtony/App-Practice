import _ from 'lodash';
import { AppState } from 'react-native';

import { saveCart } from './cart';


const subscribeToAppStateChanged = (handler) => (dispatch) => {
    const appStateListener = (state) => {
        handler(state);
        __DEV__ && console.log({ type: 'APPSTATE_CHANGED', state });
        dispatch({ type: 'APPSTATE_CHANGED', state });
    };

    appStateListener(AppState.currentState);
    AppState.addEventListener('change', appStateListener);
    return () => AppState.removeEventListener('change', appStateListener);
};



export const appStart = () => async (dispatch, getState) => {
    const appStateListener = (state) => {

        const { user, appInfo } = getState();
        const prevState = appInfo.state;

        if (user && state !== prevState && state === 'background') {
            dispatch(saveCart());
        };
    }

    dispatch(subscribeToAppStateChanged(appStateListener));

};
