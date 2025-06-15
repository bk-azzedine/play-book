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
  SendResetPasswordEmail = '[Auth] Send Reset Password Email',
  SendResetPasswordEmailSuccess = '[Auth] Send Reset Password Email Complete',
  SendResetPasswordEmailFailure = '[Auth] Send Reset Password Email Failure',
  ValidateResetCode = '[Auth API] Validate code Account',
  ValidateResetCodeSuccess = '[Auth API Validation code Success',
  ValidateResetCodeFailure = '[Auth API Validation code Failure',
  ResetPassword = '[Auth API] Reset Password',
  ResetPasswordSuccess = '[Auth API Reset password Success',
  ResetPasswordFailure = '[Auth API Reset password Failure'

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
  props<{ token: string, user: User }>()
);

export const LoginFailure = createAction(
  AuthActionTypes.LoginFailure,
  props<{ error: any }>()
);

export const LoginSuccessNotEnabled = createAction(
  AuthActionTypes.LoginSuccessNotEnabled,
  props<{ token: string, user: User }>()
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
  props<{ code: string }>()
);

export const ValidationSuccess = createAction(
  AuthActionTypes.ValidateSuccess,
  props<{ token: string }>()
);
export const ValidationFailure = createAction(
  AuthActionTypes.ValidationFailure,
  props<{ error: any }>()
);

export const Logout = createAction(AuthActionTypes.Logout);

export const LogoutConfirmed = createAction(AuthActionTypes.LogoutConfirmed);

export const LogoutCancelled = createAction(AuthActionTypes.LogoutCancelled,
  props<{ error: any }>()
);


export const RefreshSuccess = createAction(
  AuthActionTypes.RefreshSuccess,
  props<{ token: string, user: User }>()
);
export const SendResetPasswordEmail = createAction(
  AuthActionTypes.SendResetPasswordEmail
  , props<{ email: string }>()
);
export const SendResetPasswordEmailSuccess = createAction(
  AuthActionTypes.SendResetPasswordEmailSuccess,
  props<{ res: string }>()
);
export const SendResetPasswordEmailFailure = createAction(
  AuthActionTypes.SendResetPasswordEmailFailure,
  props<{ error: any }>()
);
export const ValidateResetCode = createAction(
  AuthActionTypes.ValidateResetCode
  , props<{ code: string }>()
);
export const ValidateResetCodeSuccess = createAction(
  AuthActionTypes.ValidateResetCodeSuccess,
  props<{ res: string }>()
);
export const ValidateResetCodeFailure = createAction(
  AuthActionTypes.ValidateResetCodeFailure,
  props<{ error: any }>()
);
export const ResetPassword = createAction(
  AuthActionTypes.ResetPassword
  , props<{ password: string, code: string }>()
);
export const ResetPasswordSuccess = createAction(
  AuthActionTypes.ResetPasswordSuccess,
  props<{ res: string }>()
);
export const ResetPasswordFailure = createAction(
  AuthActionTypes.ResetPasswordFailure,
  props<{ error: any }>()
);


