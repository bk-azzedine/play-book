import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';

import {RegisterFailure, RegisterSuccess, CompanyActionTypes} from '../actions/company.actions';
import {catchError, exhaustMap, map, of, tap} from 'rxjs';
import {TeamService} from '../../core/services/team/team.service';
import {CreateFailure, CreateSuccess, InviteFailure, InviteSuccess, TeamActionTypes} from '../actions/team.actions';
import {AuthActionTypes, ResendCodeComplete, ResendCodeFailure} from '../actions/auth.actions';
import {HttpErrorResponse} from '@angular/common/http';


@Injectable()
export class TeamEffect {
  private  actions$ = inject(Actions);
  private teamService = inject(TeamService);

  registerTeam$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TeamActionTypes.Create),
      exhaustMap((action) =>
        this.teamService.registerTeam(action.team).pipe(
          map(team => {
            return CreateSuccess({ team });
          }),
          catchError(error => {
            return of(CreateFailure( error?.error.message ));
          })
        )
      )
    );
  });
  invite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActionTypes.Invite),
      exhaustMap((action) => {
        return this.teamService.invite(action.teamInvite).pipe(
          map(response => {
            return InviteSuccess({ res: response });
          }),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = error.error?.message || 'invite failed';
            return of(InviteFailure({ error: errorMessage }));
          })
        );
      })
    )
  );

}
