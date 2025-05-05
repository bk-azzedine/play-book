import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {UserService} from '../../core/services/user/user.service';
import {RegisterFailure, RegisterSuccess, UserActionTypes} from '../actions/user.actions';
import {catchError, exhaustMap, map, of, tap} from 'rxjs';


@Injectable()
export class UserEffects {
  private  actions$ = inject(Actions);
  private userService = inject(UserService);

  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UserActionTypes.Register),
      exhaustMap((action) =>
        this.userService.register(action.user).pipe(
          map(res => {
            return RegisterSuccess({ token: res.token, user: res.user  });
          }),
          catchError(error => {
            return of(RegisterFailure( error?.error.message ));
          })
        )
      )
    );
  });

}
