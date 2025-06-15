import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map, of, tap} from 'rxjs';
import {
  CreateSpaceFailure,
  CreateSpaceSuccess, DeleteSpaceSuccess, UpdateSpaceFailure, UpdateSpaceSuccess,
} from '../actions/space.actions';
import {SpaceActionTypes} from '../actions/space.actions';
import {SpaceService} from '../../core/services/space/space.service';


@Injectable()
export class SpaceEffect {
  private  actions$ = inject(Actions);
  private spaceService = inject(SpaceService);

  createSpace$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SpaceActionTypes.CreateSpace),
      exhaustMap((action) =>
        this.spaceService.createSpace(action.space).pipe(
          map(space => {
            return CreateSpaceSuccess({space: space});
          }),
          catchError(error => {
            return of(CreateSpaceFailure( error?.error.message ));
          })
        )
      )
    );
  });
  updateSpace$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SpaceActionTypes.UpdateSpace),
      exhaustMap((action) =>
        this.spaceService.updateSpace(action.space).pipe(
          map(space => {
            return UpdateSpaceSuccess({space: space});
          }),
          catchError(error => {
            return of(UpdateSpaceFailure( error?.error.message ));
          })
        )
      )
    );
  });

  deleteSpace$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SpaceActionTypes.DeleteSpace),
      exhaustMap((action) =>
        this.spaceService.deleteSpace(action.id).pipe(
          map(res => {
            return DeleteSpaceSuccess({res: res as string, id: action.id});
          }),
          catchError(error => {
            return of(DeleteSpaceSuccess( error?.error.message ));
          })
        )
      )
    );
  });




}
