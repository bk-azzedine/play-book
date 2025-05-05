import {createFeatureSelector, createSelector} from '@ngrx/store';
import {CompanyState} from '../states/company.state';


const selectTeams = createFeatureSelector<CompanyState>('company')

export const selectAllTeams = createSelector(
  selectTeams,
  (state: CompanyState) => state.selectedCompany?.teams
);


