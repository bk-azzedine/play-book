import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType, OnInitEffects} from '@ngrx/effects';
import {
  AuthActionTypes, Login,
  LoginFailure,
  LoginSuccess,
  LoginSuccessNotEnabled,
  LoginSuccessNotSetUp, Logout, LogoutCancelled, LogoutConfirmed, ResendCodeComplete, ResendCodeFailure,
  ValidationFailure,
  ValidationSuccess
} from '../actions/auth.actions';
import {catchError, exhaustMap, map, mergeMap, of} from 'rxjs';
import {AuthService} from '../../core/services/auth/auth.service';
import {JwtService} from '../../core/services/jwt/jwt.service';
import {HttpErrorResponse} from '@angular/common/http';




@Injectable()
export class AuthEffects  {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private jwtService = inject(JwtService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(Login),
      exhaustMap((action) =>
        this.authService.login(action.credentials).pipe(
          map((response) => {
            const token = response.token;
            const user = response.user;
            if (this.jwtService.isUserEnabled(token)) {
              if (this.jwtService.isUserSetUp(token)) {
                return LoginSuccess({token, user});
              } else {
                return LoginSuccessNotSetUp({token, user});
              }
            } else {
              return LoginSuccessNotEnabled({token, user});
            }
          }),
          catchError((error) => {
            const errorMessage = error?.error?.message || 'Unknown error';
            return of(LoginFailure({error: errorMessage}));
          })
        )
      )
    )
  );

  validateAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActionTypes.Validate),
      exhaustMap((action) => {
        return this.authService.validateAccount(action.code).pipe(
          map(response => {
            return ValidationSuccess({token: response.token});
          }),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = error.error?.message || 'Validation failed';
            return of(ValidationFailure({error: errorMessage}));
          })
        );
      })
    )
  );
  resendCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActionTypes.ResendCode),
      exhaustMap((action) => {
        return this.authService.resendCode().pipe(
          map(response => {
            return ResendCodeComplete({res: response});
          }),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = error.error?.message || 'Validation failed';
            return of(ResendCodeFailure({error: errorMessage}));
          })
        );
      })
    )
  );

  logOut = createEffect(() =>
    this.actions$.pipe(
      ofType(Logout),
      exhaustMap(() =>
        this.authService.logOut().pipe(
          map(() => LogoutConfirmed()),
          catchError(error => of(LogoutCancelled({error})))
        )
      )
    )
  );

}
