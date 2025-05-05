import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CompanyState } from '../states/company.state';

export const selectCompanyState = createFeatureSelector<CompanyState>('company');

export const selectAllCompanies = createSelector(
  selectCompanyState,
  (state: CompanyState) => state.companies
);

export const selectSelectedCompany = createSelector(
  selectCompanyState,
  (state: CompanyState) => state.selectedCompany
);

export const selectCompanyLoading = createSelector(
  selectCompanyState,
  (state: CompanyState) => state.loading
);

export const selectCompanyError = createSelector(
  selectCompanyState,
  (state: CompanyState) => state.error
);
