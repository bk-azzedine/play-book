// meta-reducers.ts
import { ActionReducer, MetaReducer } from '@ngrx/store';
import {AppState} from '../../states/app.state';
import {AuthActionTypes} from '../../actions/auth.actions';


import { initialAuthState } from '../auth.reducer';
import { initialCompanyState } from '../company.reducer';
import { initialDocumentState } from '../document.reducer';

export function appMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function (state, action) {
    if (action.type === AuthActionTypes.Logout) {
      state = {
        auth: initialAuthState,
        company: initialCompanyState,
        documents: initialDocumentState,
      };
    }
    return reducer(state, action);
  };
}


export const metaReducers: MetaReducer<AppState>[] = [appMetaReducer];
