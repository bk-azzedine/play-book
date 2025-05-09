// store/actions/document.actions.ts
import { createAction, props } from '@ngrx/store';
import { Document } from '../models/document.model';
export enum DocumentActionTypes {
  Load = '[Documents] Load Recent',
  LoadSuccess = '[Documents] Load Recent Success',
  LoadFailure = '[Documents] Load Recent Failure',
  Save = '[Documents] Save Document',
  SaveSuccess = '[Documents] Save Document Success',
  SaveFailure = '[Documents] Save Document Failure',
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
export const saveDocument = createAction(
  DocumentActionTypes.Save,
  props<{ document: Document }>()
);
export const saveDocumentSuccess = createAction(
  DocumentActionTypes.SaveSuccess,
  props<{ document: Document }>()
);
export const saveDocumentFailure = createAction(
  DocumentActionTypes.SaveFailure,
  props<{ error: any }>()
);
