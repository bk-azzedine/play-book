import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CompanyState } from '../states/company.state';
import {selectUserId} from './auth.selector';
import {Document} from '../models/document.model';
import {selectAllDocuments} from './document.selector';
import {DocumentState} from '../states/document.state';
import {Space} from '../models/Space.model';

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
        space.members?.some(member => member.user.userId === userId)
      );
  }
);
export const selectTeamSpaces = createSelector(
  selectSelectedCompany,
  selectUserId,
  (company, userId) => {
    if (!userId || !company?.teams) return [];

    const userTeams = company.teams.filter(team =>
      team.members?.some(member => member.user.userId === userId)
    );
    return userTeams.flatMap(team => team.spaces || []);
  }
);


export const selectAllSpaces = createSelector(
  selectSelectedCompany,
  (company) => {
    if (!company?.teams) return [];
    return company.teams
      .flatMap(team => team.spaces ?? [])
      .filter((space): space is Space => space !== undefined && space !== null);
  }
);



export const selectSpaceById = (spaceId: string) => createSelector(
  selectAllSpaces,
  (spaces: Space[]) => spaces.find(space => space.spaceId === spaceId)
);


