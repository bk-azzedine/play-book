import {createAction, props} from '@ngrx/store';
import {User} from '../models/user.model';

export enum UserActionTypes {
  Register = '[User] Register',
  RegisterSuccess = '[User] Register Success',
  RegisterFailure = '[User] Register Failure',
  RegisterUserWithInvite = '[User] Register User With Invite',
  RegisterUserWithInviteSuccess = '[User] Register User With Invite Success',
  RegisterUserWithInviteFailure = '[User] Register User With Invite Failure'
}


export const RegisterUser = createAction(
  UserActionTypes.Register,
  props<{ user: User }>()
);

export const RegisterSuccess = createAction(
  UserActionTypes.RegisterSuccess,
  props<{ token: string, user: User }>()
);
export const RegisterFailure = createAction(
  UserActionTypes.RegisterFailure,
  props<{ error: any }>()
);

export const RegisterUserWithInvite = createAction(
  UserActionTypes.RegisterUserWithInvite,
  props<{ user: User, inviteId: string }>()
);

export const RegisterUserWithInviteSuccess = createAction(
  UserActionTypes.RegisterUserWithInviteSuccess,
  props<{ token: string, user: User }>()
);
export const RegisterUserWithInviteFailure = createAction(
  UserActionTypes.RegisterUserWithInviteFailure,
  props<{ error: any }>()
);


