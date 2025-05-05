import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map, of, tap, withLatestFrom} from 'rxjs';
import {loadRecentDocumentsSuccess, loadRecentDocumentsFailure} from '../actions/document.actions';
import {DocumentActionTypes} from '../actions/document.actions';
import {DocumentService} from '../../core/services/document/document.service';
import {Store} from '@ngrx/store';
import {selectUserId} from '../selectors/auth.selector';
import {selectSelectedCompany} from '../selectors/company.selector';


@Injectable()
export class DocumentEffects {
  private actions$ = inject(Actions);
  private documentService = inject(DocumentService);
  private store = inject(Store);

  loadRecentDocuments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentActionTypes.Load),
      withLatestFrom(
        this.store.select(selectSelectedCompany),
        this.store.select(selectUserId)
      ),
      exhaustMap(([_, organization, user]) =>
        this.documentService.loadRecentDocs(organization?.organizationId! , user!).pipe(
          map(response => loadRecentDocumentsSuccess({ documents: response })),
          catchError(error => {
            return of(loadRecentDocumentsFailure(error));
          })
        )
      )
    );
  });


}
