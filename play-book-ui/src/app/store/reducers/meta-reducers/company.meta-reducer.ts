import { ActionReducer } from '@ngrx/store';

const STORAGE_KEY = 'selectedCompany';

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
          const selectedCompanyData = JSON.parse(saved);
          console.log('Restoring selected company:', selectedCompanyData);

          // Create a new state object with the stored company data
          // This approach modifies the state after the reducer has run
          if (nextState && nextState.company) {
            nextState = {
              ...nextState,
              company: {
                ...nextState.company,
                selectedCompany: selectedCompanyData
              }
            };
          }
        } catch (e) {
          console.error('Error parsing selected company from localStorage:', e);
        }
      }
    }

    // Save the complete selectedCompany object to localStorage
    const selectedCompany = nextState?.company?.selectedCompany;

    if (selectedCompany) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCompany));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }

    return nextState;
  };
}
