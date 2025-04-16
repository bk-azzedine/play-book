import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';

import {RegisterFailure, RegisterSuccess, CompanyActionTypes} from '../actions/company.actions';
import {catchError, exhaustMap, map, of, tap} from 'rxjs';
import {TeamService} from '../../core/services/team/team.service';
import {CreateFailure, CreateSuccess, TeamActionTypes} from '../actions/team.actions';


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

}
