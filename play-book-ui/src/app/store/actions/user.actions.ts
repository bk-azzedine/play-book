import {createAction, props} from '@ngrx/store';
import {User} from '../models/user.model';

export enum UserActionTypes{
  Register = '[User] Register',
  RegisterSuccess = '[User] Register Success',
  RegisterFailure = '[User] Register Failure'
}



export const RegisterUser = createAction(
  UserActionTypes.Register,
  props<{user: User}>()
);

export const RegisterSuccess = createAction(
  UserActionTypes.RegisterSuccess,
  props<{user: User}>()
);
export const RegisterFailure = createAction(
  UserActionTypes.RegisterFailure,
  props<{error: any}>()
);


