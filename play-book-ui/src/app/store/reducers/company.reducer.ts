import {createReducer, on} from '@ngrx/store';
import {RegisterSuccess, CompanyActionTypes} from '../actions/company.actions';

import {Company} from '../states/company/company.state';

export const initialCompanyState: Company = {
  organizationId:'',
  field:'',
  name:'',
  ownerId:''
}

export const companyReducer = createReducer(initialCompanyState,
  on(RegisterSuccess, (state, action) => {
    return {
      ...state,
      organizationId:action.company.organizationId,
      field:action.company.field,
      name:action.company.name,
      ownerId:action.company.ownerId,
    }
  })
);


