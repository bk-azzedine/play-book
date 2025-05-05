import {AuthState} from '../states/auth.state';
import {
  LoginSuccess,
  LoginSuccessNotEnabled,
  LoginSuccessNotSetUp, LogoutConfirmed, RefreshSuccess,
  ValidationSuccess
} from '../actions/auth.actions';
import {createReducer, on} from '@ngrx/store';
import {RegisterSuccess} from '../actions/user.actions';

export const initialAuthState: AuthState = {
  token: '',
  isLoggedIn: false,
  user: null
}

export const authReducer = createReducer(
  initialAuthState,
  on(LoginSuccess,RefreshSuccess,RegisterSuccess, LoginSuccessNotEnabled,  LoginSuccessNotSetUp, (state, action) => ({
    ...state,
    isLoggedIn: true,
    token: action.token,
    user: action.user
  })),
  on(ValidationSuccess,  (state, action) => ({
    ...state,
    isLoggedIn: true,
    token: action.token,
    user: null
  }))
);
