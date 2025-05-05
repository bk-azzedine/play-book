
import {DocumentState} from '../states/document.state';
import {createReducer, on} from '@ngrx/store';
import {loadRecentDocumentsSuccess} from '../actions/document.actions';


export const initialDocumentState: DocumentState = {
documents: []

}

export const documentReducer = createReducer(
  initialDocumentState,
  on(loadRecentDocumentsSuccess, (state, { documents }) => ({
    ...state,
    documents: documents,
  }))
);
