import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RouterActionTypes} from '../actions/router.actions';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {AuthActionTypes} from '../actions/auth.actions';
import {UserActionTypes} from '../actions/user.actions';
import {CompanyActionTypes} from '../actions/company.actions';

@Injectable({
  providedIn: 'root'
})
export class RouterEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);

  activateAccount$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UserActionTypes.RegisterSuccess, AuthActionTypes.LoginSuccessNotEnabled),
        tap(action => this.router.navigate(['activate-account'])),
      ),
    { dispatch: false }
  );
  logOut$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActionTypes.Logout),
        tap(action => this.router.navigate(['login'])),
      ),
    { dispatch: false }
  );

  validateAccount$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActionTypes.ValidateSuccess, AuthActionTypes.LoginSuccessNotSetUp),
        tap(action => this.router.navigate(['onboarding/welcome'])),
      ),
    { dispatch: false }
  );
  login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActionTypes.LoginSuccess),
        tap(action => this.router.navigate(['organizations'])),
      ),
    { dispatch: false }
  );

  navigateTeams$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActionTypes.RegisterSuccess),
        tap(action => this.router.navigate(['onboarding/teams'])),
      ),
    { dispatch: false }
  );
  navigateToCompany$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActionTypes.SelectCompany),
        tap(action => this.router.navigate(['/home'])),
      ),
    { dispatch: false }
  );

  navigate$ = createEffect(() =>
      this.actions$.pipe(
        ofType(RouterActionTypes.Navigate),

        tap(action => this.router.navigate([action.path])),
      ),
    { dispatch: false }
  );
}
