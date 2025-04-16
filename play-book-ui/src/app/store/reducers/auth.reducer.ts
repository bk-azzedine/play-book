import {Auth} from '../states/auth/auth.state';
import {
  LoginSuccess,
  LoginSuccessNotEnabled,
  LoginSuccessNotSetUp,
  ValidateAccount,
  ValidationSuccess
} from '../actions/auth.actions';
import {createReducer, on} from '@ngrx/store';

export const initialAuthState: Auth = {
  token: '',
  isLoggedIn: false
}

export const authReducer = createReducer(
  initialAuthState,
  on(LoginSuccess, LoginSuccessNotEnabled, ValidationSuccess, LoginSuccessNotSetUp, (state, action) => ({
    ...state,
    isLoggedIn: true,
    token: action.token
  }))
);
