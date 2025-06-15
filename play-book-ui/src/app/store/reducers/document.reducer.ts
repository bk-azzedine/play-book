
import {DocumentState} from '../states/document.state';
import {createReducer, on} from '@ngrx/store';
import {
  loadAllDocumentsSuccess, loadDraftDocumentsSuccess, loadFavoriteDocuments, loadFavoriteDocumentsSuccess,
  loadOneDocumentSuccess,
  loadRecentDocumentsSuccess,
  loadSpaceDocumentsSuccess,
  saveDocumentSuccess
} from '../actions/document.actions';


export const initialDocumentState: DocumentState = {
documents: []

}

export const documentReducer = createReducer(
  initialDocumentState,
  on(loadRecentDocumentsSuccess, (state, { documents }) => ({
    ...state,
    documents: documents,
  })),
  on(saveDocumentSuccess, (state, { document }) => ({
    ...state,
    documents: [...state.documents, document],
  })),
  on(loadOneDocumentSuccess, (state, { document }) => ({
    ...state,
    documents: [...state.documents, document],
  })),
  on(loadSpaceDocumentsSuccess, (state, { documents }) => ({
    ...state,
    documents: documents,
  })),
  on(loadAllDocumentsSuccess, (state, { documents }) => ({
    ...state,
    documents: documents,
  })),
  on(loadDraftDocumentsSuccess, (state, { documents }) => ({
    ...state,
    documents: documents,
  })),
  on(loadFavoriteDocumentsSuccess, (state, { documents }) => ({
    ...state,
    documents: documents,
  })),

);
