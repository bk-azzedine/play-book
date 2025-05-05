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
