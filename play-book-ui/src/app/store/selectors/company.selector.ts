import {Company} from '../states/company/company.state';
import {createFeatureSelector, createSelector} from '@ngrx/store';

const selectCompany = createFeatureSelector<Company>('company')

export const selectCompanyId = createSelector(
  selectCompany,
  (state: Company)=> state.organizationId
);
