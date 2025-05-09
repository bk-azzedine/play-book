import { ActionReducer } from '@ngrx/store';

const STORAGE_KEY = 'user';

export function userStorageMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    // Rehydrate state
    if (state === undefined) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const userData = JSON.parse(saved);
        state = {
          ...state,
          auth: {
            ...state?.auth,
            user: userData
          }
        };
      }
    }

    const nextState = reducer(state, action);

    // Save user data to localStorage, excluding token and isLoggedIn
    const userData = nextState?.auth?.user;
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    return nextState;
  };
}
