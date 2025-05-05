import {AuthState} from '../states/auth.state';
import {
  LoginSuccess,
  LoginSuccessNotEnabled,
  LoginSuccessNotSetUp, LogoutConfirmed, RefreshSuccess,
  ValidationSuccess
} from '../actions/auth.actions';
import {createReducer, on} from '@ngrx/store';
import {RegisterSuccess} from '../actions/user.actions';
import {AppState} from '../states/app.state';

export const initialAppState: AppState = {
  auth: null,
  company: null,
  documents: null
}

export const appReducer = createReducer(
  initialAppState,
  on(LogoutConfirmed, (state) => ({
    ...state,
    auth: null,
    company: null,
    documents: null
  }))
);
