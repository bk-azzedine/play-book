import {Auth} from '../states/auth/auth.state';
import {createFeatureSelector, createSelector} from '@ngrx/store';

const selectedAuth = createFeatureSelector<Auth>('auth')

export const selectIsLoggedIn = createSelector(
  selectedAuth,
  (state: Auth)=> state.isLoggedIn
);
export const selectToken = createSelector(
  selectedAuth,
  (state: Auth)=> state.token
);
