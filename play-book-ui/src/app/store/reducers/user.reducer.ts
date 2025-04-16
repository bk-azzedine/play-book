import {createReducer, on} from '@ngrx/store';
import {RegisterSuccess, UserActionTypes} from '../actions/user.actions';
import {User} from '../states/user/user.state';

export const initialUserState: User = {
   user_id: '',
  firstName: '',
  lastName: '',
  email: '',

}

export const userReducer = createReducer(initialUserState,
on(RegisterSuccess, (state, action) => {
  return {
    ...state,
    user_id: action.user.user_id,
    firstName: action.user.firstName,
    lastName: action.user.lastName,
    email: action.user.email
  }
})
);

