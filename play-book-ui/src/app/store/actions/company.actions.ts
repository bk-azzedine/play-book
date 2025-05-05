import {createAction, props} from '@ngrx/store';
import {Company} from '../models/company.model';

export enum CompanyActionTypes {
  Register = '[Company] Register',
  RegisterSuccess = '[Company] Register Success',
  RegisterFailure = '[Company] Register Failure',
  LoadCompanies = '[Company] Load Companies',
  LoadCompaniesSuccess = '[Company] Load Companies Success',
  LoadCompaniesFailure = '[Company] Load Companies Failure',
  SelectCompany = '[Company] Select Company',
}

export const RegisterCompany = createAction(
  CompanyActionTypes.Register,
  props<{ company: Company }>()
);
export const RegisterSuccess = createAction(
  CompanyActionTypes.RegisterSuccess,
  props<{ company: Company }>()
);

export const RegisterFailure = createAction(
  CompanyActionTypes.RegisterFailure,
  props<{ error: any }>()
);
export const LoadCompanies = createAction(
  CompanyActionTypes.LoadCompanies
);
export const LoadCompaniesSuccess = createAction(
  CompanyActionTypes.LoadCompaniesSuccess,
  props<{ companies: Company[] }>()
);
export const LoadCompaniesFailure = createAction(
  CompanyActionTypes.LoadCompaniesFailure,
  props<{ error: any }>()
);
export const SelectCompany = createAction(
  CompanyActionTypes.SelectCompany,
  props<{ selectedCompany: Company }>()
);

