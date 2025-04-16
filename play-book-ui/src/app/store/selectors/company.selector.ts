import {Company} from '../states/company/company.state';
import {createFeatureSelector, createSelector} from '@ngrx/store';

const selectedAuth = createFeatureSelector<Company>('company')

export const selectCompanyId = createSelector(
  selectedAuth,
  (state: Company)=> state.organizationId
);
