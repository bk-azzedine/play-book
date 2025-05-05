import {createAction, props} from '@ngrx/store';
import {Credentials} from '../models/credentials.model';
import {User} from '../models/user.model';

export enum AuthActionTypes {
  Login = '[Login Page] Login',
  LoginComplete = '[Login Page] Login Complete',
  LoginSuccess = '[Auth API] Login Success',
  LoginSuccessNotEnabled = '[Auth API] Login Success User Not Enabled',
  LoginSuccessNotSetUp = '[Auth API] Login Success User Not Set Up',
  LoginFailure = '[Auth API] Login Failure',
  CheckLogin = '[Auth] Check Login',
  Logout = '[Auth] Confirm Logout',
  LogoutCancelled = '[Auth] Logout Cancelled',
  LogoutConfirmed = '[Auth] Logout Confirmed',
  ResendCode = '[Auth] Resend Activation Code',
  ResendCodeComplete = '[Auth] Resend Activation Code Completed',
  ResendCodeFailure = '[Auth] Resend Activation Code Failed',
  Validate = '[Auth API] Validate Account',
  ValidateSuccess = '[Auth API Validation Success',
  ValidationFailure = '[Auth API Validation Failure',
  InitializeAuth = '[Auth] Initialize Auth',
  RefreshSuccess = '[Auth] Refresh Auth',


}

export const Login = createAction(
  AuthActionTypes.Login,
  props<{ credentials: Credentials }>()
);

export const LoginComplete = createAction(AuthActionTypes.LoginComplete);

export const LoginSuccess = createAction(
  AuthActionTypes.LoginSuccess,
  props<{ token: string, user: User }>()
);
export const LoginSuccessNotSetUp = createAction(
  AuthActionTypes.LoginSuccessNotSetUp,
  props<{  token: string, user: User}>()
);

export const LoginFailure = createAction(
  AuthActionTypes.LoginFailure,
  props<{ error: any }>()
);

export const LoginSuccessNotEnabled = createAction(
  AuthActionTypes.LoginSuccessNotEnabled,
  props<{ token: string, user: User}>()
)
export const ResendCode = createAction(
  AuthActionTypes.ResendCode
);
export const ResendCodeComplete = createAction(
  AuthActionTypes.ResendCodeComplete,
  props<{ res: string }>()
);
export const ResendCodeFailure = createAction(
  AuthActionTypes.ResendCodeFailure,
  props<{ error: any }>()
);

export const ValidateAccount = createAction(
  AuthActionTypes.Validate,
  props<{code: string}>()
);

export const ValidationSuccess = createAction(
  AuthActionTypes.ValidateSuccess,
  props<{ token: string}>()
);
export const ValidationFailure = createAction(
  AuthActionTypes.ValidationFailure,
  props<{ error: any}>()
);

export const Logout = createAction(AuthActionTypes.Logout);

export const LogoutConfirmed = createAction(AuthActionTypes.LogoutConfirmed);

export const LogoutCancelled = createAction(AuthActionTypes.LogoutCancelled,
  props<{error: any}>()
  );


export const RefreshSuccess = createAction(
  AuthActionTypes.RefreshSuccess,
  props<{ token: string, user: User }>()
);

