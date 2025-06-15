import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DocumentState } from '../states/document.state';
import { Document } from '../models/document.model';

// Feature selector for documents slice of state
const selectDocumentsState = createFeatureSelector<DocumentState>('documents');

// Base selector to get all documents
export const selectAllDocuments = createSelector(
  selectDocumentsState,
  (state: DocumentState) => state.documents
);
/**
 * Selector to get 6 most recent documents that a user worked on in the same organization
 *
 * @param userId
 * @param organizationId The ID of the organization
 * @returns The 6 most recent documents the user worked on in the organization
 */

export const selectRecentUserDocuments = (userId: string, organizationId: string) =>
  createSelector(
    selectAllDocuments,
    (documents: Document[]) => {
      console.log('Running selector with userId:', userId, 'organizationId:', organizationId);
      console.log('All documents:', documents);

      // Filter documents by organization and user involvement
      const userDocuments = documents.filter(doc => {
        // Check if document belongs to specified organization
        const isInOrganization = doc.organization === organizationId;

        // Check if user is involved with the document based on email
        const isUserInvolved = doc.authors && Array.isArray(doc.authors) && doc.authors.some(author => {
          // If you're matching by email, assuming userId is an email
          if (author && typeof author === 'object' && author.userId) {
            return author.userId === userId;
          }
          // Or if you need to match by some other property
          // This is just a fallback if there's another way to identify the user
          return false;
        });

        console.log(`Doc ${doc.id}: isInOrganization=${isInOrganization}, isUserInvolved=${isUserInvolved}`);
        return isInOrganization && isUserInvolved;
      });

      console.log('Filtered user documents:', userDocuments);

      // Sort by lastUpdated in descending order (most recent first)
      const sortedDocuments = [...userDocuments].sort((a, b) => {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      });

      console.log('Final sorted documents:', sortedDocuments.slice(0, 6));
      // Return the 6 most recent documents
      return sortedDocuments.slice(0, 6);
    }

  );

export const selectDocumentById = (documentId: string) => createSelector(
  selectAllDocuments,
  (documents: Document[]) => documents.find(doc => doc.id === documentId)
);
export const selectSpaceDocuments = (spaceId: string) => createSelector(
  selectAllDocuments,
  (documents: Document[]) => documents.filter(doc => doc.space === spaceId)
);

export const selectAllUserDocuments = (userId: string, organizationId: string) =>
  createSelector(
    selectAllDocuments,
    (documents: Document[]) => {
      console.log('Running selector with userId:', userId, 'organizationId:', organizationId);
      console.log('All documents:', documents);

      // Filter documents by organization and user involvement
      const userDocuments = documents.filter(doc => {
        // Check if document belongs to specified organization
        const isInOrganization = doc.organization === organizationId;

        // Check if user is involved with the document based on email
        const isUserInvolved = doc.authors && Array.isArray(doc.authors) && doc.authors.some(author => {
          // If you're matching by email, assuming userId is an email
          if (author && typeof author === 'object' && author.userId) {
            return author.userId === userId;
          }
          // Or if you need to match by some other property
          // This is just a fallback if there's another way to identify the user
          return false;
        });

        console.log(`Doc ${doc.id}: isInOrganization=${isInOrganization}, isUserInvolved=${isUserInvolved}`);
        return isInOrganization && isUserInvolved;
      });

      console.log('Filtered user documents:', userDocuments);
      return userDocuments;
    }
  );

export const selectAllUserDraftDocuments = (userId: string, organizationId: string) =>
  createSelector(
    selectAllDocuments, // Use the base selector to get all documents
    (documents: Document[]) => {
      // Basic null/undefined check for 'documents' to prevent 'filter' errors
      if (!documents) {
        console.warn('selectAllUserDraftDocuments: documents array is null or undefined.');
        return [];
      }

      console.log('Running selectAllUserDraftDocuments with userId:', userId, 'organizationId:', organizationId);
      console.log('All documents:', documents);

      const userDraftDocuments = documents.filter(doc => {
        const isInOrganization = doc.organization === organizationId;
        const isDraft = doc.draft === true; // <--- Added specific draft check

        const isUserInvolved = doc.authors && Array.isArray(doc.authors) && doc.authors.some(author => {
          return author && typeof author === 'object' && author.userId === userId;
        });

        console.log(`Doc ${doc.id}: isInOrganization=${isInOrganization}, isUserInvolved=${isUserInvolved}, isDraft=${isDraft}`);
        // Combine all conditions: in organization, user involved, AND is a draft
        return isInOrganization && isUserInvolved && isDraft;
      });

      console.log('Filtered user draft documents:', userDraftDocuments);
      return userDraftDocuments;
    }
  );


export const selectAllUserFavoriteDocuments = (userId: string, organizationId: string) =>
  createSelector(
    selectAllDocuments, // Use the base selector to get all documents
    (documents: Document[]) => {
      // Basic null/undefined check for 'documents' to prevent 'filter' errors
      if (!documents) {
        console.warn('selectAllUserFavoriteDocuments: documents array is null or undefined.');
        return [];
      }

      console.log('Running selectAllUserFavoriteDocuments with userId:', userId, 'organizationId:', organizationId);
      console.log('All documents:', documents);

      const userFavoriteDocuments = documents.filter(doc => {
        const isInOrganization = doc.organization === organizationId;
        const isFavorite = doc.favorite === true; // <--- Added specific favorite check

        const isUserInvolved = doc.authors && Array.isArray(doc.authors) && doc.authors.some(author => {
          return author && typeof author === 'object' && author.userId === userId;
        });

        console.log(`Doc ${doc.id}: isInOrganization=${isInOrganization}, isUserInvolved=${isUserInvolved}, isFavorite=${isFavorite}`);
        // Combine all conditions: in organization, user involved, AND is a favorite
        return isInOrganization && isUserInvolved && isFavorite;
      });

      console.log('Filtered user favorite documents:', userFavoriteDocuments);
      return userFavoriteDocuments;
    }
  );
