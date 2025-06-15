import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, exhaustMap, map, of, tap, withLatestFrom} from 'rxjs';
import {
  loadRecentDocumentsSuccess,
  loadRecentDocumentsFailure,
  saveDocumentSuccess,
  saveDocumentFailure,
  loadOneDocumentSuccess,
  loadOneDocumentFailure,
  loadSpaceDocumentsSuccess,
  loadSpaceDocumentsFailure,
  loadAllDocuments,
  loadAllDocumentsSuccess,
  loadAllDocumentsFailure,
  loadDraftDocumentsSuccess, loadDraftDocumentsFailure
} from '../actions/document.actions';
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
      ofType(DocumentActionTypes.LoadRecent),
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

  loadAllDocuments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentActionTypes.Load),
      withLatestFrom(
        this.store.select(selectSelectedCompany),
        this.store.select(selectUserId)
      ),
      exhaustMap(([_, organization, user]) =>
        this.documentService.loadAllDocuments(organization?.organizationId! , user!).pipe(
          map(response => loadAllDocumentsSuccess({ documents: response })),
          catchError(error => {
            return of(loadAllDocumentsFailure(error));
          })
        )
      )
    );
  });

  loadDraftDocuments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentActionTypes.LoadDraftDocs),
      withLatestFrom(
        this.store.select(selectSelectedCompany),
        this.store.select(selectUserId)
      ),
      exhaustMap(([_, organization, user]) =>
        this.documentService.loadDraftDocuments(organization?.organizationId! , user!).pipe(
          map(response => loadDraftDocumentsSuccess({ documents: response })),
          catchError(error => {
            return of(loadDraftDocumentsFailure(error));
          })
        )
      )
    );
  });

  loadFavoriteDocuments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentActionTypes.LoadFavoriteDocs),
      withLatestFrom(
        this.store.select(selectSelectedCompany),
        this.store.select(selectUserId)
      ),
      exhaustMap(([_, organization, user]) =>
        this.documentService.loadFavoriteDocuments(organization?.organizationId! , user!).pipe(
          map(response => loadDraftDocumentsSuccess({ documents: response })),
          catchError(error => {
            return of(loadDraftDocumentsFailure(error));
          })
        )
      )
    );
  });

  saveDocument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentActionTypes.Save),
      exhaustMap((action) =>
        this.documentService.saveDocument(action.document).pipe(
          map(response => saveDocumentSuccess({ document: response })),
          catchError(error => {
            return of(saveDocumentFailure(error));
          })
        )
      )
    );
  });

  loadOneDocument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentActionTypes.LoadOne),
      exhaustMap((action) =>
        this.documentService.loadOneDocument(action.documentId).pipe(
          map(response => loadOneDocumentSuccess({ document: response })),
          catchError(error => {
            return of(loadOneDocumentFailure(error));
          })
        )
      )
    );
  });

  loadSpaceDocuments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DocumentActionTypes.LoadSpaceDocs),
      exhaustMap((action) =>
        this.documentService.loadSpaceDocuments(action.space).pipe(
          map(response => loadSpaceDocumentsSuccess({ documents: response })),
          catchError(error => {
            return of(loadSpaceDocumentsFailure(error));
          })
        )
      )
    );
  });


}
