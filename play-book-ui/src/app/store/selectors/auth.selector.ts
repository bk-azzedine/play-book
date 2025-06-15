import {AuthState} from '../states/auth.state';
import {createFeatureSelector, createSelector} from '@ngrx/store';

const selectedAuth = createFeatureSelector<AuthState>('auth')

export const selectIsLoggedIn = createSelector(
  selectedAuth,
  (state: AuthState)=> state.isLoggedIn
);
export const selectToken = createSelector(
  selectedAuth,
  (state: AuthState)=> state.token
);

export const selectUserId = createSelector(
  selectedAuth,
  (state: AuthState)=> state.user?.userId
);
export const selectUser = createSelector(
  selectedAuth,
  (state: AuthState)=> state.user
);

