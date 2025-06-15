import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map, of, tap} from 'rxjs';
import {TeamService} from '../../core/services/team/team.service';
import {
  CreateTeamFailure,
  CreateTeamSuccess, DeclineInviteFailure, DeclineInviteSuccess, GetTeamMembersFailure, GetTeamMembersSuccess,
  InviteFailure, InviteMultipleFailure, InviteMultipleSuccess,
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
      tap(action => { console.log('action', action); }),
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

  getTeamMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActionTypes.GetTeamMembers),
      exhaustMap((action) => {
        return this.teamService.getTeamMembers(action.userIds).pipe(
          map(response => {
            return GetTeamMembersSuccess({ members: response });
          }),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = error.error?.message || 'invite failed';
            return of(GetTeamMembersFailure({ error: errorMessage }));
          })
        );
      })
    )
  );

  inviteMultiple$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActionTypes.InviteMultiple),
      exhaustMap((action) => {
        return this.teamService.inviteMultiple(action.multipleTeamInviteRequest).pipe(
          map(response => {
            return InviteMultipleSuccess({ res: response });
          }),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = error.error?.message || 'invite failed';
            return of(InviteMultipleFailure({ error: errorMessage }));
          })
        );
      })
    )
  );

  decline$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TeamActionTypes.DeclineInvite),
      exhaustMap((action) => {
        return this.teamService.decline(action.inviteId).pipe(
          map(response => {
            return DeclineInviteSuccess({ res: response });
          }),
          catchError((error: HttpErrorResponse) => {
            const errorMessage = error.error?.message || 'invite failed';
            return of(DeclineInviteFailure({ error: errorMessage }));
          })
        );
      })
    )
  );
}
