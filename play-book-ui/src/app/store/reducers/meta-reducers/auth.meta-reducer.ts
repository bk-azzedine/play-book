// store/meta-reducers/principal-sync.ts
import { ActionReducer } from '@ngrx/store';

const STORAGE_KEY = 'principal';

export function principalStorageMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    // Rehydrate state
    if (state === undefined) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const userId = JSON.parse(saved);
        state = {
          ...state,
          auth: {
            ...state?.auth,
            user: {
              ...state?.auth?.user,
              userId: userId
            }
          }
        };
      }
    }

    const nextState = reducer(state, action);

    // Save to localStorage
    const userId = nextState?.auth?.user?.userId;
    if (userId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userId));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    return nextState;
  };
}
