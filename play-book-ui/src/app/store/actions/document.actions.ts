// store/actions/document.actions.ts
import { createAction, props } from '@ngrx/store';
import { Document } from '../models/document.model';
export enum DocumentActionTypes {
  Load = '[Documents] Load Recent',
  LoadSuccess = '[Documents] Load Recent Success',
  LoadFailure = '[Documents] Load Recent Failure'
}
export const loadRecentDocuments = createAction(
  DocumentActionTypes.Load,
);
export const loadRecentDocumentsSuccess = createAction(
  DocumentActionTypes.LoadSuccess,
  props<{ documents: Document[] }>()
);
export const loadRecentDocumentsFailure = createAction(
  DocumentActionTypes.LoadFailure,
  props<{ error: any }>()
);
