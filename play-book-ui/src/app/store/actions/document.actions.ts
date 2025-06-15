// store/actions/document.actions.ts
import {createAction, props} from '@ngrx/store';
import {Document} from '../models/document.model';
import {DocumentRequest} from '../../core/requests/document.request';

export enum DocumentActionTypes {
  Load = '[Documents] Load All',
  LoadSuccess = '[Documents] Load All Success',
  LoadFailure = '[Documents] Load All Failure',
  LoadRecent = '[Documents] Load Recent',
  LoadRecentSuccess = '[Documents] Load Recent Success',
  LoadRecentFailure = '[Documents] Load Recent Failure',
  Save = '[Documents] Save Document',
  SaveSuccess = '[Documents] Save Document Success',
  SaveFailure = '[Documents] Save Document Failure',
  LoadOne = '[Documents] Load One Document',
  LoadOneSuccess = '[Documents] Load One Document Success',
  LoadOneFailure = '[Documents] Load One Document Failure',
  LoadSpaceDocs = '[Documents] Load Space Documents',
  LoadSpaceDocsFailure = '[Documents] Load Space Document Failure',
  LoadSpaceDocsSuccess = '[Documents] Load Space Document Success',
  LoadDraftDocs = '[Documents] Load Draft Documents',
  LoadDraftDocsFailure = '[Documents] Load Draft Document Failure',
  LoadDraftDocsSuccess = '[Documents] Load Draft Document Success',
  LoadFavoriteDocs = '[Documents] Load Favorite Documents',
  LoadFavoriteDocsFailure = '[Documents] Load Favorite Document Failure',
  LoadFavoriteDocsSuccess = '[Documents] Load Favorite Document Success',
  AskChat = 'Documents] Ask Chat',
  AskChatSuccess = '[Documents] Ask Chat Success',
  AskChatFailure = '[Documents] Ask Chat Failure',


}

export const loadRecentDocuments = createAction(
  DocumentActionTypes.LoadRecent,
);
export const loadRecentDocumentsSuccess = createAction(
  DocumentActionTypes.LoadRecentSuccess,
  props<{ documents: Document[] }>()
);
export const loadRecentDocumentsFailure = createAction(
  DocumentActionTypes.LoadRecentFailure,
  props<{ error: any }>()
);
export const loadAllDocuments = createAction(
  DocumentActionTypes.Load,
);
export const loadAllDocumentsSuccess = createAction(
  DocumentActionTypes.LoadSuccess,
  props<{ documents: Document[] }>()
);
export const loadAllDocumentsFailure = createAction(
  DocumentActionTypes.LoadFailure,
  props<{ error: any }>()
);
export const saveDocument = createAction(
  DocumentActionTypes.Save,
  props<{ document: DocumentRequest }>()
);
export const saveDocumentSuccess = createAction(
  DocumentActionTypes.SaveSuccess,
  props<{ document: Document }>()
);
export const saveDocumentFailure = createAction(
  DocumentActionTypes.SaveFailure,
  props<{ error: any }>()
);

export const loadOneDocument = createAction(
  DocumentActionTypes.LoadOne,
  props<{ documentId: string }>()
);
export const loadOneDocumentSuccess = createAction(
  DocumentActionTypes.LoadOneSuccess,
  props<{ document: Document }>()
);
export const loadOneDocumentFailure = createAction(
  DocumentActionTypes.LoadOneFailure,
  props<{ error: any }>()
);

export const loadSpaceDocuments = createAction(
  DocumentActionTypes.LoadSpaceDocs,
  props<{ space: string }>()
);
export const loadSpaceDocumentsSuccess = createAction(
  DocumentActionTypes.LoadSpaceDocsSuccess,
  props<{ documents: Document[] }>()
);
export const loadSpaceDocumentsFailure = createAction(
  DocumentActionTypes.LoadSpaceDocsFailure,
  props<{ error: any }>()
);

export const loadDraftDocuments = createAction(
  DocumentActionTypes.LoadDraftDocs
);
export const loadDraftDocumentsSuccess = createAction(
  DocumentActionTypes.LoadDraftDocsSuccess,
  props<{ documents: Document[] }>()
);
export const loadDraftDocumentsFailure = createAction(
  DocumentActionTypes.LoadDraftDocsFailure,
  props<{ error: any }>()
);
export const loadFavoriteDocuments = createAction(
  DocumentActionTypes.LoadFavoriteDocs,
);
export const loadFavoriteDocumentsSuccess = createAction(
  DocumentActionTypes.LoadFavoriteDocsSuccess,
  props<{ documents: Document[] }>()
);
export const loadFavoriteDocumentsFailure = createAction(
  DocumentActionTypes.LoadFavoriteDocsFailure,
  props<{ error: any }>()
);


