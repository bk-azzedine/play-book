import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CompanyState } from '../states/company.state';
import {selectUserId} from './auth.selector';

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

export const selectUserSpaces = createSelector(
  selectSelectedCompany,
  selectUserId,
  (company, userId) => {
    if (!userId || !company?.teams) return [];

    return company.teams
      .flatMap(team => team.spaces || [])
      .filter(space =>
        space.members?.some(member => member.userId === userId)
      );
  }
);
