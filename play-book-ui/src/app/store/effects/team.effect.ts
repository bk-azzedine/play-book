import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map, of} from 'rxjs';
import {TeamService} from '../../core/services/team/team.service';
import {
 CreateTeamFailure,
  CreateTeamSuccess,
  InviteFailure,
  InviteSuccess,
  TeamActionTypes
} from '../actions/team.actions';
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
            return CreateTeamSuccess({ team: team, companyId: action.team.companyId });
          }),
          catchError(error => {
            return of(CreateTeamFailure( error?.error.message ));
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
