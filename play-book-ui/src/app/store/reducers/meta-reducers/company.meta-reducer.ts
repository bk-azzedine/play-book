import { ActionReducer } from '@ngrx/store';

const STORAGE_KEY = 'organization';

export function companyStorageMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {


    // Rehydrate state from localStorage
    if (state === undefined) {
      // Instead of trying to modify undefined state, just proceed
      // We'll handle hydration differently by modifying the state after the reducer runs
      const saved = localStorage.getItem(STORAGE_KEY);
    }

    // Let the original reducer run first
    let nextState = reducer(state, action);

    // If we're initializing the application (likely a @@INIT action from Redux)
    if (action.type === '@ngrx/store/init' || action.type === '@ngrx/store/update-reducers') {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        try {
          const orgId = JSON.parse(saved);
          console.log('Restoring organization:', orgId);

          // Create a new state object with the stored organization
          // This approach modifies the state after the reducer has run
          if (nextState && nextState.company) {
            nextState = {
              ...nextState,
              company: {
                ...nextState.company,
                selectedCompany: {
                  ...(nextState.company.selectedCompany || {}),
                  organizationId: orgId
                }
              }
            };
          }
        } catch (e) {
          console.error('Error parsing organization from localStorage:', e);
        }
      }
    }

    const orgId = nextState?.company?.selectedCompany?.organizationId;

    if (orgId) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orgId));
    }

    return nextState;
  };
}
